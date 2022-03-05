'use strict';

const { GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const COMMON = {
	GREETING: (name) => `Dear ${name}`,
	CLOSING: {
		1: 'Regards',
		2: () => `${API_NAME()} team`
	},
	IP_ADDRESS: (ip) => `IP Address: ${ip}`,
	IP_REQUEST_FROM: (ip) => `Request initiated from: ${ip}`,
	TXID: (txid) => `Transaction ID: ${txid}`,
	FEE: (fee) => `Fee: ${fee}`,
	AMOUNT: (amount) => `Amount: ${amount}`,
	ADDRESS: (address) => `Address: ${address}`,
	TIME: (time) => `Time: ${time}`,
	COUNTRY: (country) => `Country: ${country}`,
	DEVICE: (device) => `Device: ${device}`,
	MESSAGE: (message) => `Message: ${message}`,
	ERROR_REQUEST:
		'If this request was made in error, it is safe to ignore it; no changes will be made to your account.',
	EXPLORER:
		'You can find the status of your transaction on blockchain through these Block Explorers:',
	DEPOSIT: 'Deposit',
	WITHDRAWAL: 'Withdrawal'
};

const FOOTER = {
	FOLLOW_US: 'Follow us on',
	NEED_HELP: 'Need help? Just reply to this email',
	PRIVACY_POLICY: 'Privacy policy',
	TERMS: 'Terms and conditions',
	INVITE_YOUR_FRIENDS: 'Invite your friends',
	POWERED_BY: 'Powered by'
};

const DEPOSIT = {
	TITLE: (currency) => `${currency.toUpperCase()} ${COMMON.DEPOSIT}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		PENDING: (amount, confirmation, currency) =>
			`You have a new deposit for ${amount} ${currency.toUpperCase()} pending in your ${API_NAME()} wallet. Please wait until the transaction is confirmed and your funds will be available in your wallet.${confirmation ? ` Your transaction requires ${confirmation} confirmation(s) on blockchain.` : ''}`,
		COMPLETED: (amount, confirmation, currency) =>
			`Your ${
				currency.toUpperCase()
			} deposit for ${amount} ${currency.toUpperCase()} is confirmed and completed and it is available in your ${
				currency.toUpperCase()
			} wallet.`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (status) => `Status: ${status}`,
		3: (address) => COMMON.ADDRESS(address),
		4: (txid) => COMMON.TXID(txid),
		5: (network) => `Network: ${network}`,
		6: (fee) => COMMON.FEE(fee),
		7: (description) => `Description: ${description}`,
		8: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWAL = {
	TITLE: (currency) =>
		`${currency.toUpperCase()} ${COMMON.WITHDRAWAL}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		PENDING: (amount, currency) =>
			`You made a withdrawal request for ${amount} ${currency.toUpperCase()}. Your withdrawal status is pending and will be processed shortly.`,
		COMPLETED: (amount, currency) =>
			`Your withdrawal request for ${amount} ${currency.toUpperCase()} is processed.`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (fee) => COMMON.FEE(fee),
		3: (status) => `Status: ${status}`,
		4: (address) => COMMON.ADDRESS(address),
		5: (txid) => COMMON.TXID(txid),
		6: (network) => `Network: ${network}`,
		7: (description) => `Description: ${description}`,
		8: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const ALERT = {
	TITLE: (title) => `ALERT: ${title}`,
	BODY: {
		1: (type) => `Alert: ${type}`
	}
};

const CONTACTFORM = {
	TITLE: 'Contact Form',
	BODY: {
		1: 'Contact Form Data',
		2: (email) =>
			`The client with email ${email} has submitted the contact form.`,
		3: (data) => `${JSON.stringify(data, null, 2)}`
	}
};

const SMS = {
	verificationCode: (code) =>
		`Your verification code is ${code}`
	,
	deposit: (currency, amount) =>
		`Your ${currency.toUpperCase()} deposit for amount ${amount} is confirmed and deposited to your wallet`
	,
	withdrawal: (currency, amount) =>
		`Your ${currency.toUpperCase()} withdrawal for amount ${amount} is confirmed`
};

const INVITEDOPERATOR = {
	TITLE: 'Operator Invite',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		CREATED: {
			1: (role, invitingEmail) => `You've been invited as an operator to ${API_NAME()} with the role of ${role} by user ${invitingEmail}.`,
			2: 'Your temporary password is provided below. Make sure to change your password after logging in for security purposes.',
			3: (email) => `Email: ${email}`,
			4: (password) => `Password: ${password}`,
			5: 'Login'
		},
		EXISTING: {
			1: (role, invitingEmail) => `Your ${API_NAME()} account has been upgraded to the role of ${role} by user ${invitingEmail}.`,
			2: 'Login'
		}
	},
	CLOSING: COMMON.CLOSING
};

const CONFIRMEMAIL = {
	TITLE: 'Security Verification',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'You have made sensitive request related to your accounts security. To verify the operation you would require to use to code below to authorize this operation.',
		2: (code) => `${code}`,
		3: 'If you did not make this request, report this immidiately and proceed to change your crendetials as soon as possible.'
	},
	CLOSING: COMMON.CLOSING
};

module.exports = {
	FOOTER,
	COMMON,
	DEPOSIT,
	WITHDRAWAL,
	CONTACTFORM,
	ALERT,
	SMS,
	INVITEDOPERATOR,
	CONFIRMEMAIL
};
