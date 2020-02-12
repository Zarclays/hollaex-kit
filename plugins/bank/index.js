'use strict';

const app = require('../index');
const { verifyToken, checkScopes } = require('../helpers/auth');
const { findUser, getUserValuesById, getUserValuesByEmail } = require('../helpers/user');
const { addBankAccount, adminAddUserBanks, approveBankAccount, rejectBankAccount } = require('./helpers');
const { USER_NOT_FOUND } = require('./messages');
const bodyParser = require('body-parser');
const { logger } = require('../helpers/common');
const { sendEmail } = require('../../mail');
const { MAILTYPE } = require('../../mail/strings');

app.post('/plugins/bank/user', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['user'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'POST /bank/user auth',
		req.auth.sub
	);

	const email = req.auth.sub.email;
	const bank_account = req.body;

	logger.info(
		'POST /bank/user bank',
		email,
		bank_account
	);

	findUser({
		where: { email }
	})
		.then(addBankAccount(bank_account))
		.then(() => getUserValuesByEmail(email))
		.then((user) => res.json(user['bank_account']))
		.catch((error) => {
			logger.error('POST /bank/user error', error.message);
			res.status(error.status || 400).json({ message: error.message })
		})
});

app.post('/plugins/bank/admin', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['admin', 'supervisor', 'support', 'kyc'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'POST /bank/admin auth',
		req.auth.sub
	);

	const { bank_account } = req.body;
	const id = req.query.user_id;

	logger.info(
		'POST /bank/admin bank',
		id,
		bank_account
	);

	findUser({
		where: {
			id
		}
	})
		.then(adminAddUserBanks(bank_account))
		.then(() => getUserValuesById(id))
		.then((user) => res.json(user['bank_account']))
		.catch((error) => {
			logger.error('POST /bank/admin error', error.message);
			res.status(error.status || 400).json({ message: error.message })
		});
});

app.post('/plugins/bank/verify', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['admin', 'supervisor', 'support', 'kyc'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'POST /bank/verify auth',
		req.auth.sub
	);

	const { user_id, bank_id } = req.body;

	logger.verbose(
		'POST /bank/verify body',
		req.body
	);

	findUser({
		where: {
			id: user_id
		},
		attributes: ['bank_account']
	})
		.then((user) => {
			if (!user) throw new Error(USER_NOT_FOUND);
			return approveBankAccount(bank_id)(user);
		})
		.then((user) => {
			const data = {};
			data.bank_account = user.bank_account;
			logger.debug(
				'POST /bank/verify data',
				data
			);
			res.json(data);
		})
		.catch((err) => {
			logger.error('POST /bank/verify error', err.message);
			res.status(err.status || 400).json({ message: err.message });
		});
});

app.post('/plugins/bank/revoke', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['admin', 'supervisor', 'support', 'kyc'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'POST /bank/revoke auth',
		req.auth.sub
	);

	const { user_id, bank_id } = req.body;
	let { message } = req.body || DEFAULT_REJECTION_NOTE;

	logger.verbose(
		'POST /bank/revoke body',
		req.body
	);

	findUser({
		where: {
			id: user_id
		},
		attributes: ['email', 'bank_account', 'settings']
	})
		.then((user) => {
			if (!user) throw new Error(USER_NOT_FOUND);
			return rejectBankAccount(bank_id)(user);
		})
		.then((user) => {
			const { email, bank_account } = user.dataValues;
			const emailData = { type: 'bank', message };
			const data = {};
			data.bank_account = bank_account;
			sendEmail(
				MAILTYPE.USER_VERIFICATION_REJECT,
				email,
				emailData,
				user.settings
			);
			logger.debug(
				'POST /bank/revoke data',
				data
			);
			res.json(data);
		})
		.catch((err) => {
			logger.error('POST /bank/revoke error', err.message);
			res.status(err.status || 400).json({ message: err.message });
		});
});