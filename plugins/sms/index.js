'use strict';

const app = require('../index');
const { verifyToken, checkScopes } = require('../helpers/auth');
const { findUser } = require('../helpers/user');
const PhoneNumber = require('awesome-phonenumber');
const bodyParser = require('body-parser');
const { createSMSCode, storeSMSCode, checkSMSCode, deleteSMSCode, sendSMS, updateUserPhoneNumber } = require('./helpers');
const DEFAULT_LANGUAGE = process.env.NEW_USER_DEFAULT_LANGUAGE || 'en';
const { SMS } = require('../../mail/strings').languageFile(DEFAULT_LANGUAGE);
const { logger } = require('../helpers/common');
const {
	SMS_INVALID_PHONE,
	SMS_SUCCESS,
	PHONE_VERIFIED
} = require('./messages');

app.get('/plugins/sms/verify', verifyToken, (req, res) => {
	const endpointScopes = ['user'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'GET /sms/verify auth',
		req.auth.sub
	);

	const phoneNumber = new PhoneNumber(req.query.phone);
	const { id } = req.auth.sub;

	if (!phoneNumber.isValid()) {
		logger.error(
			'GET /sms/verify not valid phone number',
			req.query.phone
		);
		return res.status(400).json({ message: SMS_INVALID_PHONE });
	}

	const phone = phoneNumber.getNumber();
	const code = createSMSCode();

	logger.verbose(
		'GET /sms/verify body',
		id,
		req.query.phone,
		code
	);

	sendSMS(phone, {
		message: SMS.verificationCode(code)
	})
		.then((data) => {
			return storeSMSCode(id, phone, code);
		})
		.then((data) => {
			logger.debug(
				'GET /sms/verify data',
				data
			);
			res.json({ message: SMS_SUCCESS });
		})
		.catch((error) => {
			logger.error(
				'GET /sms/verify error',
				error.message
			);
			return res.status(error.statusCode || 400).json({ message: error.message });
		});
});

app.post('/plugins/sms/verify', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['user'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'POST /sms/verify auth',
		req.auth.sub
	);

	const { id } = req.auth.sub;
	const { code } = req.body;
	const phoneNumber = new PhoneNumber(req.body.phone);

	if (!phoneNumber.isValid()) {
		logger.error(
			'POST /sms/verify not valid phone number',
			req.query.phone
		);
		return res.status(400).json({ message: SMS_INVALID_PHONE });
	}

	const phone = phoneNumber.getNumber();

	logger.verbose(
		'POST /sms/verify body',
		id,
		req.query.phone,
		code
	);

	checkSMSCode(id, phone, code)
		.then((data) => {
			return findUser({
				where: { id }, attributes: ['id', 'phone_number']
			})
		})
		.then((user) => {
			return updateUserPhoneNumber(user, phone);
		})
		.then(() => {
			return deleteSMSCode(id);
		})
		.then((data) => {
			logger.debug(
				'POST /sms/verify data',
				data
			);
			res.json({ message: PHONE_VERIFIED });
		})
		.catch((error) => {
			logger.error(
				'POST /sms/verify error',
				error.message
			);
			return res.status(error.statusCode || 400).json({ message: error.message });
		});
});