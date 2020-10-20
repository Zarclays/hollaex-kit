'use strict';

const toolsLib = require('hollaex-tools-lib');
const { loggerTier } = require('../../config/logger');

const getTiers = (req, res) => {
	try {
		return res.json({
			tiers: toolsLib.getKitTiers()
		});
	} catch (err) {
		loggerTier.error(req.uuid, 'controllers/tier/getTiers err', err.message);
		return res.status(err.status || 400).json({ message: err.message });
	}
};

const postTier = (req, res) => {
	loggerTier.verbose(req.uuid, 'controllers/tier/postTier auth', req.auth);

	const { level, name, description, deposit_limit, withdrawal_limit, fees } = req.swagger.params.data.value;

	toolsLib.tier.createTier(level, name, description, deposit_limit, withdrawal_limit, fees)
		.then((tier) => {
			return res.json(tier);
		})
		.catch((err) => {
			loggerTier.error(req.uuid, 'controllers/tier/postTier err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const putTier = (req, res) => {
	loggerTier.verbose(req.uuid, 'controllers/tier/putTier auth', req.auth);

	const { level, name, description, deposit_limit, withdrawal_limit, fees } = req.swagger.params.data.value;

	const updateData = {
		name,
		description,
		deposit_limit,
		withdrawal_limit,
		fees
	};

	toolsLib.tier.updateTier(level, updateData)
		.then((tier) => {
			return res.json(tier);
		})
		.catch((err) => {
			loggerTier.error(req.uuid, 'controllers/tier/postTier err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

module.exports = {
	getTiers,
	postTier,
	putTier
};
