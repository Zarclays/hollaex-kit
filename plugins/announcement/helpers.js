'use strict';

const { Announcement } = require('../../db/models');
const { convertSequelizeCountAndRows } = require('../helpers/common');

const postAnnouncement = (created_by, title, message, type) => {
	return Announcement.create({
		created_by,
		title,
		message,
		type
	});
};

const deleteAnnouncement = (id) => {
	return Announcement.destroy({ id });
};

const getAnnouncements = (pagination = {}, timeframe, ordering) => {
	const order = [];
	if (!ordering) {
		order.push(['created_at', 'desc']);
	} else {
		order.push(ordering);
	}
	let query = {
		order,
		...pagination
	};
	if (timeframe) query.where.created_at = timeframe;
	return Announcement.findAndCountAll(query)
		.then(convertSequelizeCountAndRows);
};

module.exports = {
	postAnnouncement,
	deleteAnnouncement,
	getAnnouncements
};