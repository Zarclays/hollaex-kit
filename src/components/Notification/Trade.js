import React from 'react';
import math from 'mathjs';
import { connect } from 'react-redux';
import { ICONS, CURRENCY_PRICE_FORMAT } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import {
	NotificationWraper,
	NotificationContent,
	InformationRow
} from './Notification';
import { formatToCurrency } from '../../utils/currency';

const SIDE_BUY = 'buy';
const SIDE_SELL = 'sell';

export const getTitleAndIcon = (side, type) => {
	const data = {
		icon: '',
		title: '',
		onBack: true,
	};

	if (side === SIDE_BUY) {
		data.icon = ICONS.TRADE_FILLED_SUCESSFUL;
		data.title = STRINGS.formatString(
			STRINGS.ORDER_TITLE_TRADE_COMPLETE,
			<span className="text-capitalize">{STRINGS.TYPES_VALUES[type]}</span>,
			STRINGS.SIDES_VALUES[SIDE_BUY]
		);
	} else if (side === SIDE_SELL) {
		data.icon = ICONS.TRADE_FILLED_SUCESSFUL;
		data.title = STRINGS.formatString(
			STRINGS.ORDER_TITLE_TRADE_COMPLETE,
			<span className="text-capitalize">{STRINGS.TYPES_VALUES[type]}</span>,
			STRINGS.SIDES_VALUES[SIDE_SELL]
		);
	}

	return data;
};

const calculateValues = (data = [], pair, coins = {}) => {
	let btcAccumulated = math.fraction(0);
	let baseAccumulated = math.fraction(0);
	const averages = [];
	const baseFormat = coins[pair.pair_base] || {};
	const secondaryFormat = coins[pair.pair_2] || {};
	data.forEach(({ size, price, filled, side }) => {
		let calcSize = size;
		if (side === SIDE_BUY) {
			calcSize = filled || size;
		} else if (side === SIDE_SELL) {
			calcSize = filled || size;
		}
		btcAccumulated = math.add(btcAccumulated, math.fraction(calcSize));
		const orderValue = math.multiply(math.fraction(price), math.fraction(calcSize));
		baseAccumulated = math.add(baseAccumulated, orderValue);
		averages.push(math.number(orderValue));
	});

	return {
		btc: formatToCurrency(btcAccumulated, baseFormat.min),
		base: formatToCurrency(baseAccumulated, secondaryFormat.min),
		average: formatToCurrency(math.median(averages), secondaryFormat.min)
	};
};

export const TradeDisplay = ({ side, data, pairs, coins, ...rest }) => {
	const pair = data[0] ? pairs[data[0].symbol] : { pair_base: '', pair_2: '' };
	const baseValue = coins[pair.pair_base] || { symbol: '' };
	const payValue = coins[pair.pair_2] || { symbol: '' };

	const actionText =
		side === 'sell' ? STRINGS.ORDER_SOLD : STRINGS.ORDER_BOUGHT;
	const resultText =
		side === 'sell' ? STRINGS.ORDER_RECEIVED : STRINGS.ORDER_SPENT;
	const { btc, base, average } = calculateValues(data, pair, coins);
	return (
		<NotificationContent>
			<InformationRow
				label={actionText}
				value={STRINGS.formatString(
					CURRENCY_PRICE_FORMAT,
					btc,
					baseValue.symbol.toUpperCase()
				)}
			/>
			<InformationRow
				label={STRINGS.ORDER_AVERAGE_PRICE}
				value={STRINGS.formatString(
					CURRENCY_PRICE_FORMAT,
					average,
					payValue.symbol.toUpperCase()
				)}
			/>
			<InformationRow
				label={resultText}
				value={STRINGS.formatString(
					CURRENCY_PRICE_FORMAT,
					base,
					payValue.symbol.toUpperCase()
				)}
			/>
		</NotificationContent>
	);
};

const TradeNotification = ({ onClose, data: { order, data }, pairs, coins }) => {
	const { side, type } = order;
	const notificationProps = getTitleAndIcon(side, type);

	return (
		<NotificationWraper
			{...notificationProps}
			className="trade-notification"
			compressOnMobile={true}
			onClose={onClose}
		>
			<TradeDisplay side={side} data={data} pairs={pairs} coins={coins} />
		</NotificationWraper>
	);
};

const mapStateToProps = state => ({
	pairs: state.app.pairs,
	coins: state.app.coins
});

export default connect(mapStateToProps)(TradeNotification);
