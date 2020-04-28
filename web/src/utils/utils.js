import moment from 'moment';

import { TOKEN_TIME, TIMESTAMP_FORMAT, AUDIOS } from '../config/constants';

const bitcoin = {
	COIN: 100000000,
	PRECISION: 8,
	DUST: 2730,
	BASE_FEE: 10000
};

/**
 * convert a BTC value to Satoshi
 *
 * @param btc   float       BTC value
 * @returns int             Satoshi value (int)
 */
bitcoin.toSatoshi = (btc) => {
	return parseInt((btc * bitcoin.COIN).toFixed(0), 10);
};

/**
 * convert a Satoshi value to BTC
 *
 * @param satoshi   int     Satoshi value
 * @returns {string}        BTC value (float)
 */
bitcoin.toBTC = (satoshi) => {
	return (satoshi / bitcoin.COIN).toFixed(bitcoin.PRECISION);
};

export default bitcoin;

export const checkUserSessionExpired = (loginTime) => {
	const currentTime = Date.now();

	return currentTime - loginTime > TOKEN_TIME;
};

export const formatTimestamp = (date, format) => {
	return formatTimestampGregorian(date, format);
};

export const formatTimestampGregorian = (date, format = TIMESTAMP_FORMAT) =>
	moment(date).format(format);

export const getDecimals = (value = 0) =>
	value % 1 ? value.toString().split('.')[1].length : 0;

export const isBlockchainTx = (transactionId) => {
	return (transactionId.indexOf('-') === -1) ? true : false
}

export const constructSettings = (state = {}, settings) => {
	let settingsData = { ...state };
	if (settings.notification) {
		settingsData.notification = { ...settingsData.notification, ...settings.notification };
	}
	if (settings.interface) {
		settingsData.interface = { ...settingsData.interface, ...settings.interface };
	}
	if (settings.audio) {
		settingsData.audio = { ...settingsData.settingsData, ...settings.audio };
	}
	if (settings.risk) {
		settingsData.risk = { ...settingsData.risk, ...settings.risk };
	}
	if (settings.chat) {
		settingsData.chat = { ...settingsData.chat, ...settings.chat }
	}
	if (settings.language) {
		settingsData.language = settings.language
	}

	// ToDo: need to these code after end point update.
	if (settings.popup_order_confirmation || settings.popup_order_confirmation === false) {
		settingsData.notification.popup_order_confirmation = settings.popup_order_confirmation;
	}
	if (settings.popup_order_completed || settings.popup_order_completed === false) {
		settingsData.notification.popup_order_completed = settings.popup_order_completed;
	}
	if (settings.popup_order_partially_filled || settings.popup_order_partially_filled === false) {
		settingsData.notification.popup_order_partially_filled = settings.popup_order_partially_filled;
	}

	if (settings.theme) {
		settingsData.interface.theme = settings.theme;
	}
	if (settings.order_book_levels) {
		settingsData.interface.order_book_levels = settings.order_book_levels;
	}

	if (settings.order_completed || settings.order_completed === false) {
		settingsData.audio.order_completed = settings.order_completed;
	}
	if (settings.order_partially_completed || settings.order_partially_completed === false) {
		settingsData.audio.order_partially_completed = settings.order_partially_completed;
	}
	if (settings.public_trade || settings.public_trade === false) {
		settingsData.audio.public_trade = settings.public_trade;
	}

	if (settings.order_portfolio_percentage) {
		settingsData.risk.order_portfolio_percentage = settings.order_portfolio_percentage;
	}
	if (settings.popup_warning || settings.popup_warning === false) {
		settingsData.risk.popup_warning = settings.popup_warning;
	}

	if (settings.set_username) {
		settingsData.chat.set_username = settings.set_username
	}
	if (settings.theme) {
		settingsData.theme = settings.theme
	}

	return settingsData;
};

export const playBackgroundAudioNotification = (type = '', audioSettings = { audio: {} }) => {
	let audioFile = '';
	switch (type) {
		case 'orderbook_market_order':
		case 'order_filled':
			if (audioSettings.audio.order_completed) {
				audioFile = AUDIOS.ORDER_COMPLETED;
			} else {
				audioFile = '';
			}
			break;
		case 'order_partialy_filled':
			if (audioSettings.audio.order_partially_completed) {
				audioFile = AUDIOS.ORDER_PARTIALLY_COMPLETED;
			} else {
				audioFile = '';
			}
			break;
		case 'orderbook_field_update':
			if (audioSettings.audio.click_amounts) {
				audioFile = AUDIOS.ORDERBOOK_FIELD_UPDATE;
			} else {
				audioFile = '';
			}
			break;
		case 'orderbook_limit_order':
			if (audioSettings.audio.order_placed) {
				audioFile = AUDIOS.ORDERBOOK_LIMIT_ORDER;
			} else {
				audioFile = '';
			}
			break;
		case 'public_trade':
			if (audioSettings.audio.public_trade) {
				audioFile = AUDIOS.PUBLIC_TRADE_NOTIFICATION;
			} else {
				audioFile = '';
			}
			break;
		case 'cancel_order':
			if (audioSettings.audio.order_canceled) {
				audioFile = AUDIOS.CANCEL_ORDER;
			} else {
				audioFile = '';
			}
			break;
		case 'quick_trade_complete':
			if (audioSettings.audio.quick_trade_success) {
				audioFile= AUDIOS.QUICK_TRADE_COMPLETE;
			} else {
				audioFile = '';
			}
			break;
		case 'review_quick_trade_order':
			if (audioSettings.audio.get_quote_quick_trade) {
				audioFile=AUDIOS.REVIEW_QUICK_TRADE_ORDER;
			} else {
				audioFile = '';
			}
			break;
		case 'time_out_quick_trade':
			if (audioSettings.audio.quick_trade_timeout) {
				audioFile=AUDIOS.TIME_OUT_QUICK_TRADE;
			} else {
				audioFile = '';
			}
			break;
		default:
	}
	if (audioSettings.audio.all === false) {
		audioFile = ''
	}
	const audio = new Audio(audioFile);
	if (audioFile) audio.play();
};
