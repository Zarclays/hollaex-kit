'use strict';

const app = require('../index');
const { verifyToken, checkScopes } = require('../helpers/auth');
const bodyParser = require('body-parser');
const { logger, isUrl } = require('../helpers/common');
const { updateVaultValues, crossCheckCoins, createOrUpdateWallets } = require('./helpers');
const { API_HOST } = require('../../constants');

app.post('/plugins/vault/connect', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['admin'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'POST /plugins/vault/connect',
		req.auth.email
	);

	if (!isUrl(API_HOST)) {
		return res.status(400).json({ message: `Server URL ${API_HOST} is not a valid URL`});
	}

	const { name, key, secret, coins } = req.body;

	updateVaultValues(name, key, secret)
		.then(() => crossCheckCoins(coins))
		.then((validCoins) => createOrUpdateWallets(validCoins))
		.then((wallets) => {
			logger.debug(
				'POST /plugins/vault/connect new_connected_coins',
				Object.keys(wallets)
			);
			res.json(wallets);
		})
		.catch((err) => {
			logger.error(
				'POST /plugins/vault/connect catch',
				err.messsage
			);
			res.status(err.status || 400).json({ message: err.message });
		});
});

app.get('/plugins/vault/disconnect', verifyToken, (req, res) => {
	const endpointScopes = ['admin'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'GET /plugins/vault/disconnect',
		req.auth.email
	);

	updateVaultValues('', '', '', false)
		.then(() => {
			logger.debug('GET /plugins/vault/disconnect successful');
			res.json({ message: 'Vault disconnected' });
		})
		.catch((err) => {
			logger.error(
				'GET /plugins/vault/disconnect catch',
				err.message
			);
			res.status(err.status || 400).json({ message: err.message });
		});
});