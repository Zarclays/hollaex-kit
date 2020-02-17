'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const { PLUGIN_PORT } = require('./constants');

const PLUGINS = process.env.PLUGINS || 'kyc,bank,sms';
const DOMAIN = process.env.DOMAIN || (process.env.NODE_ENV === 'production' ? 'https://hollaex.com' : 'http://localhost:3000');
const CORS_WHITELIST = process.env.NODE_ENV === 'production' ? [DOMAIN] : [DOMAIN, 'http://localhost:3000'];

const PORT = PLUGIN_PORT

const plugins = PLUGINS.split(',');

app.get('/plugins', (req, res) => {
	res.send(`Plugins enabled: ${plugins}`);
});

app.listen(PORT);

const corsOptions = {
	origin: function (origin, callback) {
		if (CORS_WHITELIST.indexOf(origin) !== -1) {
			callback (null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	}
};

app.use(cors(corsOptions));

module.exports = app;

plugins.forEach((plugin) => {
	if (plugin) {
		require('./' + plugin);
	}
});