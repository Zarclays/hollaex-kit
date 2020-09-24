'use strict';

const { loggerDeposits } = require('../../config/logger');
const toolsLib = require('hollaex-tools-lib');

const getAdminDeposits = (req, res) => {
	loggerDeposits.verbose(
		req.uuid,
		'controllers/deposit/getAdminDeposits auth',
		req.auth
	);

	const { user_id, currency, limit, page, order_by, order, start_date, end_date, status, dismissed, rejected, processing, waiting, format } = req.swagger.params;

	toolsLib.users.getUserDepositsByKitId(user_id.value, currency.value, status.value, dismissed.value, rejected.value, processing.value, waiting.value, limit.value, page.value, order_by.value, order.value, start_date.value, end_date.value, format.value)
		.then((data) => {
			if (format.value) {
				if (data.data.length === 0) {
					throw new Error('No data found');
				}
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-users-deposits.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerDeposits.error(
				req.uuid,
				'controllers/deposit/getAdminDeposits',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getUserDeposits = (req, res) => {
	loggerDeposits.verbose(
		req.uuid,
		'controllers/deposit/getUserDeposits auth',
		req.auth.sub
	);
	const user_id = req.auth.sub.id;
	const currency = req.swagger.params.currency.value || '';
	const { limit, page, order_by, order, start_date, end_date, format } = req.swagger.params;

	toolsLib.users.getUserDepositsByKitId(user_id, currency, limit.value, page.value, order_by.value, order.value, start_date.value, end_date.value, format.value)
		.then((data) => {
			if (format.value) {
				if (data.data.length === 0) {
					throw new Error('No data found');
				}
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-deposits.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerDeposits.error('controllers/deposit/getUserDeposits', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

module.exports = {
	getAdminDeposits,
	getUserDeposits,
};
