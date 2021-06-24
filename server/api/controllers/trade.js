'use strict';

const { loggerTrades } = require('../../config/logger');
const toolsLib = require('hollaex-tools-lib');
const { errorMessageConverter } = require('../../utils/conversion');

const getUserTrades = (req, res) => {
	loggerTrades.verbose(
		req.uuid,
		'controllers/trade/getUserTrades auth',
		req.auth.sub
	);

	const user_id = req.auth.sub.id;
	const { limit, page, order_by, order, start_date, end_date, format } = req.swagger.params;
	const symbol = req.swagger.params.symbol.value;

	if (symbol && !toolsLib.subscribedToPair(symbol)) {
		loggerTrades.error(req.uuid, 'controllers/trade/getUserTrades', 'Invalid symbol');
		return res.status(400).json({ message: 'Invalid symbol' });
	}

	toolsLib.order.getAllUserTradesByKitId(user_id, symbol, limit.value, page.value, order_by.value, order.value, start_date.value, end_date.value, format.value)
		.then((data) => {
			if (format.value === 'csv') {
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-trades.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else if (format.value === 'all') {
				res.status(203);
				data.pipe(res);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerTrades.error(req.uuid, 'controllers/trade/getUserTrades', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getAdminTrades = (req, res) => {
	loggerTrades.verbose(req.uuid, 'controllers/trade/getAdminTrades auth', req.auth);

	const { user_id, symbol, limit, page, order_by, order, start_date, end_date, format } = req.swagger.params;

	let promiseQuery;

	if (user_id.value) {
		if (format.value === 'all') {
			promiseQuery = toolsLib.order.getUserTradesByKitIdStream(
				user_id.value,
				{
					symbol: symbol.value,
					limit: limit.value,
					page: page.value,
					orderBy: order_by.value,
					order: order.value,
					startDate: start_date.value,
					endDate: end_date.value
				}
			);
		} else if (format.value === 'csv') {
			promiseQuery = toolsLib.order.getUserTradesByKitIdCsv(
				user_id.value,
				{
					symbol: symbol.value,
					limit: limit.value,
					page: page.value,
					orderBy: order_by.value,
					order: order.value,
					startDate: start_date.value,
					endDate: end_date.value
				}
			);
		} else {
			promiseQuery = toolsLib.order.getAllUserTradesByKitId(
				user_id.value,
				symbol.value,
				limit.value,
				page.value,
				order_by.value,
				order.value,
				start_date.value,
				end_date.value,
				format.value
			);
		}
	} else {
		if (format.value === 'all') {
			promiseQuery = toolsLib.order.getAllTradesNetworkStream(
				{
					symbol: symbol.value,
					limit: limit.value,
					page: page.value,
					orderBy: order_by.value,
					order: order.value,
					startDate: start_date.value,
					endDate: end_date.value
				}
			);
		} else if (format.value === 'csv') {
			promiseQuery = toolsLib.order.getAllTradesNetworkCsv(
				{
					symbol: symbol.value,
					limit: limit.value,
					page: page.value,
					orderBy: order_by.value,
					order: order.value,
					startDate: start_date.value,
					endDate: end_date.value
				}
			);
		} else {
			promiseQuery = 	toolsLib.order.getAllTradesNetwork(
				symbol.value,
				limit.value,
				page.value,
				order_by.value,
				order.value,
				start_date.value,
				end_date.value,
				format.value
			);
		}
	}

	promiseQuery
		.then((data) => {
			if (format.value) {
				if (format.value === 'csv') {
					res.setHeader('Content-disposition', `attachment; filename=${user_id.value ? `user-${user_id.value}-` : ''}trades.csv`);
					res.set('Content-Type', 'text/csv');
					res.status(202);
				}
				data.pipe(res);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerTrades.error(req.uuid, 'controllers/trade/getAdminTrades', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

module.exports = {
	getUserTrades,
	getAdminTrades
};
