'use strict';

const { getModel } = require('./database/model');
const math = require('mathjs');
const ccxt = require('ccxt');
const rp = require('request-promise');
const randomString = require('random-string');
const dbQuery = require('./database/query');
const { SERVER_PATH } = require('../constants');
const { getNodeLib } = require(`${SERVER_PATH}/init`);
const { client } = require('./database/redis');
const { getUserByKitId } = require('./user');
const { validatePair, getKitTier } = require('./common');
const _eval = require('eval');
const { sendEmail } = require('../../../mail');
const { MAILTYPE } = require('../../../mail/strings');
const { verifyBearerTokenPromise } = require('./security')
const { loggerBroker } = require('../../../config/logger');

const {
	TOKEN_EXPIRED,
	AUTH_NOT_MATCHED,
	BROKER_NOT_FOUND,
	BROKER_PAUSED,
	BROKER_ERROR_DELETE_UNPAUSED,
	BROKER_EXISTS,
	BROKER_FORMULA_NOT_FOUND,
	SPREAD_MISSING,
	MANUAL_BROKER_CREATE_ERROR,
	EXCHANGE_NOT_FOUND } = require(`${SERVER_PATH}/messages`);

const validateBrokerPair = (brokerPair) => {
	if (brokerPair.type === 'manual' && math.compare(brokerPair.buy_price, 0) !== 1) {
		throw new Error("Broker buy price must be bigger than zero.")
	} else if (brokerPair.type === 'manual' &&  math.compare(brokerPair.sell_price, 0) !== 1) {
		throw new Error("Broker sell price must be bigger than zero.")
	} else if (math.compare(brokerPair.min_size, 0) !== 1) {
		throw new Error("Broker minimum order size must be bigger than zero.")
	} else if (math.compare(brokerPair.max_size, brokerPair.min_size) !== 1) {
		throw new Error("Broker maximum order size must be bigger than minimum order size.")
	} else if (math.compare(brokerPair.increment_size, 0) !== 1) {
		throw new Error("Broker order price increment must be bigger than zero.")
	} else if (brokerPair.symbol && !validatePair(brokerPair.symbol)) {
		throw new Error('invalid symbol');
	}
}

const binanceScript = async () => {
	const BINANCE_URL = 'https://api3.binance.com/api/v3/ticker/price'

	// Get the price from redis
	const formattedSymbol = symbol.split('-').join('').toUpperCase();
	const quotePrice = await client.getAsync('prices');

	const runScript = (prices) => {
		//Calculate the price
		const foundSymbol = JSON.parse(prices).find((data) => data.symbol === formattedSymbol);
		if (!foundSymbol) {
			throw new Error('Pair not found');
		}
		const baseCurrencyPrice = calculatePrice(foundSymbol.price, side, spread, multiplier);

		const responseObject = {
			price: baseCurrencyPrice
		}
		//check if there is user_id, if so, assing token
		if (user_id) {
			// Generate randomToken to be used during deal execution
			const randomToken = generateRandomToken(user_id, symbol, side, broker.quote_expiry_time, baseCurrencyPrice);
			responseObject.token = randomToken;
		}

		return responseObject;
	}

	// If it doesn't exist, fetch all market from Binance 
	if (!quotePrice) {
		return rp(BINANCE_URL)
			.then((res) => {
				//Store all market prices in Redis with 1 minute expiry time
				//response is a stringfied object.
				client.setexAsync('prices', 60, res);

				return runScript(res);
			})
			.catch(err => {
				throw new Error(err);
			})

	} else {
		return runScript(quotePrice);
	}
}

const calculatePrice = (price, side, spread, multiplier = 1) => {
	// Calculate the price
	const parsedPrice = parseFloat(price) * multiplier;
	let calculatedSize;

	if (side === 'buy') {
		calculatedSize = parsedPrice + (parsedPrice * spread / 100)
	} else if (side === 'sell') {
		calculatedSize = parsedPrice - (parsedPrice * spread / 100)
	}

	return calculatedSize;
}

const generateRandomToken = (user_id, symbol, side, expiryTime = 30, price) => {
	// Generate random token
	const randomToken = randomString({
		length: 32,
		numeric: true,
		letters: true
	});

	// set the generated token along with trade data in Redis expiry time(quote_expiry_time)
	const tradeData = {
		user_id,
		symbol,
		price,
		side,
	}

	client.setexAsync(randomToken, expiryTime, JSON.stringify(tradeData));
	return randomToken;
}

const fetchBrokerQuote = async (brokerQuote) => {
	const { symbol, side, bearerToken, ip } = brokerQuote;

	try {
		let user_id = null;
		if (bearerToken) {
			const auth = await verifyBearerTokenPromise(bearerToken, ip);
			if (auth) {
				user_id = auth.sub.id;
			}
		}

		// Get the broker record
		const broker = await getModel('broker').findOne({ where: { symbol } });

		if (!broker) {
			throw new Error(BROKER_NOT_FOUND);
		} else if (broker.paused) {
			throw new Error(BROKER_PAUSED);
		}
		if (broker.type === 'dynamic') {
			if (broker.formula) {
				//Run formula
				const resObject = _eval(broker.formula, "formula", {
					symbol, side, user_id, client, broker, calculatePrice, generateRandomToken, rp
				}, true);

				return resObject;

			} else {
				throw new Error(BROKER_FORMULA_NOT_FOUND);
			}
		} else {
			const baseCurrencyPrice = side === 'buy' ? broker.sell_price : broker.buy_price;

			const responseObject = {
				price: baseCurrencyPrice
			}
			if (user_id) {
				const randomToken = generateRandomToken(user_id, symbol, side, broker.quote_expiry_time, baseCurrencyPrice);
				responseObject.token = randomToken
			}
			return responseObject;
		}

	} catch (err) {
		throw new Error(err);
	}
}

const reverseTransaction = async (orderData) => {
	const { userId, symbol, side, size, price } = orderData;
	const notifyUser = async (data) => {
		const user = await getUserByKitId(userId);
		sendEmail(
			MAILTYPE.ALERT,
			user.email,
			{
				type: 'binance order info',
				data,
			},
			user.settings
		);
	}
	try {
		const broker = await getModel('broker').findOne({ where: { symbol } });

		if (broker.account && broker.account.hasOwnProperty('binance')) {
			const binanceInfo = broker.account.binance;
			const exchangeId = 'binance'
				, exchangeClass = ccxt[exchangeId]
				, exchange = new exchangeClass({
					'apiKey': binanceInfo.apiKey,
					'secret': binanceInfo.apiSecret,
				})

			const formattedSymbol = symbol.split('-').join('').toUpperCase();
			const formattedRebalancingSymbol = broker.rebalancing_symbol && broker.rebalancing_symbol.split('-').join('').toUpperCase();

			if (side === 'buy') {
				exchange.createLimitBuyOrder(formattedRebalancingSymbol || formattedSymbol, size, price - price * 0.05)
					.then(res => { notifyUser(res) })
					.catch(err => { notifyUser(err) });
			} else if (side == 'sell') {
				exchange.createLimitSellOrder(formattedRebalancingSymbol || formattedSymbol, size, price + price * 0.05)
					.then(res => { notifyUser(res) })
					.catch(err => { notifyUser(err) });
			}
		}
	} catch (err) {
		loggerBroker.error(err);
	}

}

const createBrokerPair = async (brokerPair) => {
	validateBrokerPair(brokerPair);
	return fetchBrokerPair(brokerPair.symbol)
		.then((deal) => {
			if (deal) {
				throw new Error(BROKER_EXISTS)
			}
			const {
				formula,
				exchange_name,
				spread,
				multiplier,
				type
			} = brokerPair;

			if (exchange_name && type === 'manual') {
				throw new Error(MANUAL_BROKER_CREATE_ERROR);
			}

			if (exchange_name && !spread) {
				throw new Error(SPREAD_MISSING);
			}

			let adminFormula = null;

			if (type === 'dynamic') {
				// If it is a custom script(users send their own formula)
				if (formula) {
					adminFormula = formula;
				}
				// If user selects a exchange
				else if (exchange_name === 'binance') {
					const binanceFormula = `
					const spread = ${spread}; 
					const multiplier = ${multiplier || 1}; 
					module.exports = (${binanceScript.toString()})()
				`;

					adminFormula = binanceFormula;
				} else {
					throw new Error(EXCHANGE_NOT_FOUND)
				}
			}
			const newBrokerObject = {
				...brokerPair,
				formula: adminFormula
			};


			return getModel("broker").create(newBrokerObject, { raw: true });
		})
}

const fetchBrokerPair = (symbol) => {
	return getModel("broker").findOne({ where: { symbol } });
}

async function fetchBrokerPairs(attributes) {
	return await getModel("broker").findAll({ attributes });
}

const updateBrokerPair = async (id, data) => {
	const brokerPair = await getModel("broker").findOne({ where: { id } });
	if (!brokerPair) {
		throw new Error(BROKER_NOT_FOUND);
	}

	const {
		user_id,
		exchange_name,
		spread,
		multiplier,
		buy_price,
		sell_price,
		min_size,
		max_size,
		increment_size,
		paused,
		type,
		quote_expiry_time,
		rebalancing_symbol,
		account,
		formula } = data;
	if (exchange_name && type === 'manual') {
		throw new Error(MANUAL_BROKER_CREATE_ERROR);
	}

	if (exchange_name && !spread) {
		throw new Error(SPREAD_MISSING);
	}

	//Validate account JSONB object
	if (account) {
		for (const [key, value] of Object.entries(account)) {
			if (!value.hasOwnProperty('apiKey')) {
				value.apiKey = brokerPair.account[key].apiKey;
			}

			if (!value.hasOwnProperty('apiSecret')) {
				value.apiSecret = brokerPair.account[key].apiSecret;
			}
		}
	}
	const updatedPair = {
		user_id: user_id || brokerPair.user_id,
		buy_price: buy_price || brokerPair.buy_price,
		sell_price: sell_price || brokerPair.sell_price,
		min_size: min_size || brokerPair.min_size,
		max_size: max_size || brokerPair.max_size,
		increment_size: increment_size || brokerPair.increment_size,
		paused: paused || brokerPair.paused,
		type: type || brokerPair.type,
		quote_expiry_time: quote_expiry_time || brokerPair.quote_expiry_time,
		rebalancing_symbol: rebalancing_symbol || brokerPair.rebalancing_symbol,
		account,
		formula: formula || brokerPair.formula,
	};

	validateBrokerPair(updatedPair);
	if (exchange_name === 'binance') {

		const binanceFormula = `
			const spread = ${spread}; 
			const multiplier = ${multiplier || 1}; 
			module.exports = (${binanceScript.toString()})()
		`;

		updatedPair.formula = binanceFormula;
	} else if (exchange_name && exchange_name !== 'binance') {
		throw new Error(EXCHANGE_NOT_FOUND)
	}

	return brokerPair.update(updatedPair, {
		fields: [
			'buy_price',
			'sell_price',
			'min_size',
			'max_size',
			'increment_size',
			'paused',
			'type',
			'quote_expiry_time',
			'rebalancing_symbol',
			'account',
			'formula'
		]
	});
}

const deleteBrokerPair = async (id) => {
	const brokerPair = await getModel("broker").findOne({ where: { id } });

	if (!brokerPair) {
		throw new Error(BROKER_NOT_FOUND);
	} else if (!brokerPair.paused) {
		throw new Error(BROKER_ERROR_DELETE_UNPAUSED);
	}

	return brokerPair.destroy();
}

const executeBrokerDeal = async (userId, token, size) => {
	const storedToken = await client.getAsync(token);
	if (!storedToken) {
		throw new Error(TOKEN_EXPIRED);
	}
	const { user_id, symbol, price, side } = JSON.parse(storedToken);

	if (user_id !== userId) {
		throw new Error(AUTH_NOT_MATCHED);
	}

	const brokerPair = await getModel("broker").findOne({ where: { symbol } });

	if (!brokerPair) {
		throw new Error(BROKER_NOT_FOUND);
	} else if (brokerPair.paused) {
		throw new Error(BROKER_PAUSED);
	}

	const broker = await getUserByKitId(brokerPair.user_id);
	const user = await getUserByKitId(userId);

	const tierBroker = getKitTier(broker.verification_level);
	const tierUser = getKitTier(user.verification_level);

	const makerFee = tierBroker.fees.maker[symbol];
	const takerFee = tierUser.fees.taker[symbol];

	return getNodeLib().createBrokerTrade(
		symbol,
		side,
		price,
		size,
		broker.network_id,
		user.network_id,
		{ maker: makerFee, taker: takerFee }
	);
}

module.exports = {
	createBrokerPair,
	fetchBrokerPair,
	fetchBrokerPairs,
	updateBrokerPair,
	deleteBrokerPair,
	executeBrokerDeal,
	fetchBrokerQuote,
	reverseTransaction
};
