'use strict';

const DOMAIN = require('../../init').getConfiguration().constants.domain;
const DEFAULT_LANGUAGE = require('../../init').getConfiguration().constants.defaults.language;
const API_NAME = require('../../init').getConfiguration().constants.api_name;
const { TemplateEmail } = require('./helpers/common');
const { MAILTYPE } = require('../strings');

const generateMessageContent = (
	type,
	email,
	data = {},
	language = DEFAULT_LANGUAGE,
	domain = DOMAIN
) => {
	const STRINGS = require('../strings').languageFile(language);
	let title;
	if (
		type === MAILTYPE.WITHDRAWAL ||
		type === MAILTYPE.DEPOSIT ||
		type === MAILTYPE.WITHDRAWAL_REQUEST
	) {
		title = STRINGS[type.toUpperCase()].TITLE(data.currency);
	} else if (type === MAILTYPE.DEPOSIT_CANCEL) {
		title = STRINGS[type.toUpperCase()].TITLE(data.currency, data.type);
	} else if (type === MAILTYPE.USER_VERIFICATION_REJECT) {
		title = STRINGS[type.toUpperCase()].TITLE(data.type);
	} else {
		title = STRINGS[type.toUpperCase()].TITLE;
	}
	const subject = `${API_NAME} ${title}`;
	const message = require(`./${type}`)(email, data, language, domain);
	const result = {
		subject: subject,
		html: TemplateEmail({ title }, message.html, language, domain),
		text: message.text
	};
	return result;
};

module.exports = generateMessageContent;
