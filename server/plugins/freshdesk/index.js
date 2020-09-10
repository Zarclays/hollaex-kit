'use strict';

const app = require('../index');
const { verifyToken, checkScopes } = require('../helpers/auth');
const { GET_KIT_SECRETS } = require('../../constants');
const { logger, updatePluginConstant, maskSecrets } = require('../helpers/common');
const bodyParser = require('body-parser');

app.get('/plugins/freshdesk/constant', verifyToken, (req, res) => {
	const endpointScopes = ['admin', 'tech'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'GET /plugins/freshdesk/constant auth',
		req.auth.sub
	);

	try {
		res.json(maskSecrets('freshdesk', GET_KIT_SECRETS().plugins.freshdesk) || {});
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

app.put('/plugins/freshdesk/constant', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['admin', 'tech'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'PUT /plugins/chat/constant auth',
		req.auth.sub
	);

	if (req.body.length === 0) {
		logger.error('PUT /plugins/freshdesk/constant error', 'Must provide key to update');
		return res.status(400).json({ message: 'Must provide key to update' });
	}

	logger.info(
		'PUT /plugins/freshdesk/constant body',
		req.body
	);

	updatePluginConstant('freshdesk', req.body)
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			res.status(400).json({ message: err.message });
		});
});
