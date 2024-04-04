const path = require('path');

process.env.NODE_ENV = 'test';
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const crypto = require('crypto');
const chai = require('chai'),
	chaiHTTP = require('chai-http'),
	tools = require('hollaex-tools-lib');

chai.use(chaiHTTP);
chai.should();
const _ = require("lodash"); 

const testURL = process.env.TEST_URL || 'http://localhost:10010';
const testURLPlugin = process.env.TEST_URL || 'http://localhost:10011';

function generateFuzz(length = 10000) {
	let result = '';
	let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+|{}:>?:"~';
	let charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

function getAdminUser() {
	return {
		email: process?.argv?.slice(5)?.[0]?.split('=')?.[1] || process?.argv?.[2]?.split('=')?.[1]
	};
}

function getNewUserCredentials() {
	return {
	  	email: `${_.shuffle('test_auth'.split('')).join('')}.${Math.floor(Math.random() * 10000)}@mail.com`,
     	password: "test112233.",
	};
}


async function loginAs(user, session = true) {
	const token = await tools.security.issueToken(
		user.id,
		user.network_id,
		user.email,
		null,
		user.is_admin,
		user.is_support,
		user.is_supervisor,
		user.is_kyc,
		user.is_communicator);

	if(session) {
		const hashedToken = crypto.createHash('md5').update(token).digest('hex');

		await tools.database.getModel('session').create({
			token: hashedToken,
			role: 'admin',
			login_id: 1,
			status: true,
			last_seen: new Date(),
			expiry_date:  new Date().setDate(new Date().getDate() + 1)
		})

	}
	
	return token;
}

function request() {
	const req = chai.request(testURL);

	return req;
}

function requestPlugin() {
	const req = chai.request(testURLPlugin);

	return req;
}

module.exports = {
	loginAs,
	request,
	generateFuzz,
	getAdminUser,
	requestPlugin,
	getNewUserCredentials
};
