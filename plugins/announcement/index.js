'use strict';

const app = require('../index');
const { verifyToken, checkScopes } = require('../helpers/auth');
const { postAnnouncement, deleteAnnouncement, getAnnouncements, findAnnouncement } = require('./helpers');
const bodyParser = require('body-parser');
const { logger, getPagination, getTimeframe, getOrdering } = require('../helpers/common');
const { WRONG_TITLE, WRONG_MESSAGE, WRONG_TYPE, WRONG_ID } = require('./messages');
// const { sendEmail } = require('../../mail');
// const { MAILTYPE } = require('../../mail/strings');

app.post('/plugins/announcement', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['admin'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'POST /plugins/announcement auth',
		req.auth.sub
	);

	let { title, message, type } = req.body;

	if (!title || typeof title !== 'string') {
		logger.error('POST /plugins/announcement error', WRONG_TITLE);
		return res.status(400).json({ message: WRONG_TITLE });
	} else if (!message || typeof message !== 'string') {
		logger.error('POST /plugins/announcement error', WRONG_MESSAGE);
		return res.status(400).json({ message: WRONG_MESSAGE });
	} else if (type && typeof type !== 'string') {
		logger.error('POST /plugins/announcement error', WRONG_TYPE);
		return res.status(400).json({ message: WRONG_TYPE });
	}

	if (!type) type = 'info';

	logger.info(
		'POST /plugins/announcement announcement',
		title,
		type
	);

	postAnnouncement(req.auth.sub.id, title, message, type)
		.then((announcement) => {
			logger.debug('POST /plugins/announcement success ID: ', announcement.dataValues.id);
			res.json(announcement);
		})
		.catch((error) => {
			logger.error('POST /plugins/announcement error', error.message);
			res.status(error.status || 400).json({ message: error.message });
		});
});

app.delete('/plugins/announcement', verifyToken, (req, res) => {
	const endpointScopes = ['admin'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'DELETE /plugins/announcement auth',
		req.auth.sub
	);

	const id = parseInt(req.query.id);

	if (!id) {
		logger.error('DELETE /plugins/announcement error', WRONG_ID);
		return res.status(400).json({ message: WRONG_ID });
	}

	findAnnouncement(id)
		.then((announcement) => {
			if (!announcement) {
				throw new Error(`Announcement with id ${id} not found`);
			} else {
				return deleteAnnouncement(id);
			}
		})
		.then(() => {
			logger.debug('DELETE /plugins/announcement success ID: ', id);
			res.json({ message: `Announcement ${id} successfully deleted` });
		})
		.catch((error) => {
			logger.error('DELETE /plugins/announcement error', error.message);
			res.status(error.status || 400).json({ message: error.message });
		});
});

app.get('/plugins/announcements', (req, res) => {
	const { limit, page, order_by, order, start_date, end_date } = req.query;

	if (limit && !parseInt(limit)) {
		logger.error('GET /plugins/announcements error', 'Value \'limit\' must be an integer');
		return res.status(400).json({ message: 'Value \'limit\' must be an integer' });
	} else if (page && !parseInt(page)) {
		logger.error('GET /plugins/announcements error', 'Value \'page\' must be an integer');
		return res.status(400).json({ message: 'Value \'page\' must be an integer' });
	} else if (order_by && order_by.includes(' ')) {
		logger.error('GET /plugins/announcements error', 'Value \'order_by\' cannot include whitespaces');
		return res.status(400).json({ message: 'Value \'order_by\' cannot include whitespaces' });
	} else if (order && (order !== 'asc' || order!== 'desc')) {
		logger.error('GET /plugins/announcements error', 'Value \'order\' must be one of: [\'asc\', \'desc\']');
		return res.status(400).json({ message: 'Value \'order\' must be one of: [\'asc\', \'desc\']' });
	}

	logger.info(
		'GET /plugins/announcements',
		limit,
		page,
		order_by,
		order,
		start_date,
		end_date
	);

	getAnnouncements(getPagination(limit, page), getTimeframe(start_date, end_date), getOrdering(order_by, order))
		.then((announcements) => {
			logger.debug('GET /plugins/annoucements');
			return res.json(announcements);
		})
		.catch((error) => {
			logger.error('GET /plugins/announcements error', error.message);
			res.status(error.status || 400).json({ message: error.message });
		});
});