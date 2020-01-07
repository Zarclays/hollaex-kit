import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import io from 'socket.io-client';
import { debounce } from 'lodash';
import { WS_URL, SESSION_TIME, BASE_CURRENCY } from '../../config/constants';
import { isMobile } from 'react-device-detect';

import { logout } from '../../actions/authAction';
import { setMe, setBalance, updateUser } from '../../actions/userAction';
import { addUserTrades } from '../../actions/walletActions';
import {
	setUserOrders,
	addOrder,
	updateOrder,
	removeOrder
} from '../../actions/orderAction';
import {
	setOrderbooks,
	setTrades,
	setOrderbook,
	addTrades,
	setPairsData
} from '../../actions/orderbookAction';
import {
	setTickers,
	setPairs,
	changePair,
	setCurrencies,
	setNotification,
	closeNotification,
	openContactForm,
	openHelpfulResourcesForm,
	setLanguage,
	changeTheme,
	closeAllNotification,
	setChatUnreadMessages,
	setOrderLimits,
	NOTIFICATIONS,
	setSnackDialog,
	setValidBaseCurrency,
	setConfig,
	setInfo
} from '../../actions/appActions';

import { playBackgroundAudioNotification } from '../../utils/utils';
import { getToken, isLoggedIn } from '../../utils/token';

class Container extends Component {
	state = {
		publicSocket: undefined,
		privateSocket: undefined,
		idleTimer: undefined,
		ordersQueued: [],
		limitFilledOnOrder: ''
	};

	limitTimeOut = null;

	componentDidMount() {
		if (!this.props.fetchingAuth) {
			this.initSocketConnections();
		}
	}

	componentWillReceiveProps(nextProps) {
		if (
			!nextProps.fetchingAuth &&
			nextProps.fetchingAuth !== this.props.fetchingAuth
		) {
			if (!this.state.publicSocket) {
				this.initSocketConnections();
			}
		}
	}

	componentWillUnmount() {
		if (this.state.publicSocket) {
			this.state.publicSocket.close();
		}

		if (this.state.privateSocket) {
			this.state.privateSocket.close();
		}

		if (this.state.idleTimer) {
			clearTimeout(this.state.idleTimer);
		}
		clearTimeout(this.limitTimeOut);
	}

	_resetTimer = () => {
		if (this.state.idleTimer) {
			clearTimeout(this.idleTimer);
		}
		if (this.state.appLoaded) {
			const idleTimer = setTimeout(() => this.logout('Inactive'), SESSION_TIME); // no activity will log the user out automatically
			this.setState({ idleTimer });
		}
	};

	resetTimer = debounce(this._resetTimer, 250);

	initSocketConnections = () => {
		this.setPublicWS();
		if (isLoggedIn()) {
			this.setUserSocket(getToken());
		}
		this.setState({ appLoaded: true }, () => {
			this._resetTimer();
		});
	};

	setPublicWS = () => {
		const publicSocket = io(`${WS_URL}/realtime`, {
			query: {
				// symbol: 'btc'
			}
		});

		this.setState({ publicSocket });

		publicSocket.on('initial', (data) => {
			if (!this.props.pair) {
				const pair = Object.keys(data.pairs)[0];
				this.props.changePair(pair);
			}
			this.props.setPairs(data.pairs);
			this.props.setPairsData(data.pairs);
			this.props.setCurrencies(data.coins);
			if (data.config) this.props.setConfig(data.config);
			if (data.info) this.props.setInfo(data.info);
			const pairWithBase = Object.keys(data.pairs).filter((key) => {
				let temp = data.pairs[key];
				return temp.pair_2 === BASE_CURRENCY;
			});
			const isValidPair = pairWithBase.length > 0;
			this.props.setValidBaseCurrency(isValidPair);
			const orderLimits = {};
			Object.keys(data.pairs).map((pair, index) => {
				orderLimits[pair] = {
					PRICE: {
						MIN: data.pairs[pair].min_price,
						MAX: data.pairs[pair].max_price,
						STEP: data.pairs[pair].increment_price
					},
					SIZE: {
						MIN: data.pairs[pair].min_size,
						MAX: data.pairs[pair].max_size,
						STEP: data.pairs[pair].increment_price
					}
				};
				return '';
			});
			this.props.setOrderLimits(orderLimits);
		});

		publicSocket.on('orderbook', (data) => {
			this.props.setOrderbooks(data);
		});

		publicSocket.on('trades', (data) => {
			this.props.setTrades(data);
			this.props.setTickers(data);
			if (data.action === 'update') {
				if (
					this.props.settings.audio &&
					this.props.settings.audio.public_trade &&
					this.props.location.pathname.indexOf('/trade/') === 0 &&
					this.props.params.pair
				) {
					playBackgroundAudioNotification('public_trade');
				}
			}
		});

		publicSocket.on('wave', (data) => {
			console.log('wave', data);
			this.props.setNotification(NOTIFICATIONS.WAVE_NOTIFICATION, {
				wave: data
			});
		});
	};

	setUserSocket = (token) => {
		const privateSocket = io.connect(`${WS_URL}/user`, {
			query: {
				token: `Bearer ${token}`
			}
		});

		this.setState({ privateSocket });

		privateSocket.on('error', (error) => {
			if (
				error &&
				typeof error === 'string' &&
				error.indexOf('Access Denied') > -1
			) {
				this.logout('Token is expired');
			}
		});

		privateSocket.on('user', ({ action, data }) => {
			this.props.setMe(data);
			if (
				data.settings &&
				data.settings.language !== this.props.activeLanguage
			) {
				this.props.changeLanguage(data.settings.language);
			}
			if (
				data.settings.interface &&
				data.settings.interface.theme !== this.props.activeTheme
			) {
				this.props.changeTheme(data.settings.interface.theme);
				localStorage.setItem('theme', data.settings.interface.theme);
			}
		});

		privateSocket.on('orders', ({ action, data }) => {
			this.props.setUserOrders(data);
		});

		privateSocket.on('trades', ({ action, data }) => {
			// this.props.addUserTrades(data);
		});

		privateSocket.on('wallet', ({ action, balance }) => {
			this.props.setBalance(balance);
		});

		privateSocket.on('update', ({ action, type, data }) => {
			switch (type) {
				case 'order_queued':
					// TODO add queued orders to the store
					// this.props.addOrder(data);
					this.setState({
						ordersQueued: this.state.ordersQueued.concat(data)
					});
					if (data.type === 'limit') {
						playBackgroundAudioNotification('orderbook_limit_order');
						this.setState({ limitFilledOnOrder: data.id });
						this.limitTimeOut = setTimeout(() => {
							if (this.state.limitFilledOnOrder)
								this.setState({ limitFilledOnOrder: '' });
						}, 1000);
					}
					break;
				case 'order_processed':
				case 'order_canceled': {
					const ordersQueued = [].concat(this.state.ordersQueued);
					const indexOfOrder = ordersQueued.findIndex(
						(order) => order.id === data.id
					);
					if (indexOfOrder > -1) {
						ordersQueued.splice(indexOfOrder, 1);
					}
					this.setState({ ordersQueued });
					break;
				}
				case 'order_added': {
					const { ordersQueued } = this.state;
					const indexOfOrder = ordersQueued.findIndex(
						({ id }) => id === data.id
					);
					if (indexOfOrder > -1) {
						ordersQueued.splice(indexOfOrder, 1);
						this.setState({ ordersQueued });
					}
					this.props.addOrder(data);
					// this.props.setNotification(NOTIFICATIONS.ORDERS, { type, data });
					break;
				}
				case 'order_partialy_filled': {
					// let filled = 0;
					// const order = this.props.orders.find(order => order.id === data.id)
					// if (order) {
					// 	filled = order.filled;
					// }
					this.props.updateOrder(data);
					if (
						this.props.settings.notification &&
						this.props.settings.notification.popup_order_partially_filled
					) {
						// data.filled = data.filled - filled;
						if (isMobile) {
							this.props.setSnackDialog({
								isDialog: true,
								type: 'order',
								data: {
									type,
									order: data,
									data
								}
							});
						} else {
							this.props.setNotification(NOTIFICATIONS.ORDERS, {
								type,
								order: data,
								data
							});
						}
					}
					if (
						this.props.settings.audio &&
						this.props.settings.audio.order_partially_completed
					) {
						playBackgroundAudioNotification('order_partialy_filled');
					}
					break;
				}
				case 'order_updated':
					this.props.updateOrder(data);
					this.props.setNotification(
						NOTIFICATIONS.ORDERS,
						{ type, data },
						false
					);
					break;
				case 'order_filled': {
					const ordersDeleted = this.props.orders.filter((order, index) => {
						return (
							data.findIndex((deletedOrder) => deletedOrder.id === order.id) >
							-1
						);
					});
					this.props.removeOrder(data);
					if (
						this.props.settings.notification &&
						this.props.settings.notification.popup_order_completed
					) {
						ordersDeleted.forEach((orderDeleted) => {
							if (isMobile) {
								this.props.setSnackDialog({
									isDialog: true,
									type: 'order',
									data: {
										type,
										data: {
											...orderDeleted,
											filled: orderDeleted.size
										}
									}
								});
							} else {
								this.props.setNotification(NOTIFICATIONS.ORDERS, {
									type,
									data: {
										...orderDeleted,
										filled: orderDeleted.size
									}
								});
							}
						});
					}
					if (
						this.props.settings.audio &&
						this.props.settings.audio.order_completed
					) {
						playBackgroundAudioNotification('order_filled');
					}
					break;
				}
				case 'order_removed':
					this.props.removeOrder(data);
					this.props.setNotification(
						NOTIFICATIONS.ORDERS,
						{ type, data },
						false
					);
					break;
				case 'trade': {
					this.props.addUserTrades(data.reverse());
					const tradeOrdersIds = new Set();
					data.forEach((trade) => {
						if (trade.order) {
							tradeOrdersIds.add(trade.order.id);
						}
					});
					if (tradeOrdersIds.size === 1) {
						const orderIdFromTrade = Array.from(tradeOrdersIds)[0];
						const { ordersQueued } = this.state;
						let order = ordersQueued.find(({ id }) => id === orderIdFromTrade);
						if (!order) {
							const { orders } = this.props;
							order = orders.find(({ id }) => id === orderIdFromTrade);
						}
						if (
							order &&
							order.type === 'market' &&
							this.props.settings.notification &&
							this.props.settings.notification.popup_order_completed
						) {
							if (isMobile) {
								this.props.setSnackDialog({
									isDialog: true,
									type: 'trade',
									data: { order, data }
								});
							} else {
								this.props.setNotification(NOTIFICATIONS.TRADES, {
									data,
									order
								});
							}
						}
					}
					if (
						this.state.limitFilledOnOrder &&
						data.filter((limit) => limit.id === this.state.limitFilledOnOrder)
							.length &&
						this.props.settings.audio &&
						this.props.settings.audio.order_completed
					) {
						setTimeout(() => {
							playBackgroundAudioNotification('order_filled');
						}, 1000);
					}
					break;
				}
				case 'deposit': {
					const show = data.status || data.currency !== BASE_CURRENCY;
					data.coins = this.props.coins;
					this.props.setNotification(NOTIFICATIONS.DEPOSIT, data, show);
					break;
				}
				case 'withdrawal': {
					// TODO FIX when notification is defined

					const show = data.amount;
					this.props.setNotification(NOTIFICATIONS.WITHDRAWAL, data, !show);
					break;
				}
				default:
					break;
			}
		});
	};

	render() {
		return <div />;
	}
}

const mapStateToProps = (store) => ({
	pair: store.app.pair,
	coins: store.app.coins,
	symbol: store.orderbook.symbol,
	prices: store.orderbook.prices,
	fetchingAuth: store.auth.fetching,
	activeNotification: store.app.activeNotification,
	verification_level: store.user.verification_level,
	activeLanguage: store.app.language,
	activeTheme: store.app.theme,
	orders: store.order.activeOrders,
	user: store.user,
	unreadMessages: store.app.chatUnreadMessages,
	orderbooks: store.orderbook.pairsOrderbooks,
	pairsTrades: store.orderbook.pairsTrades,
	settings: store.user.settings,
	config: store.app.config,
	info: store.app.info
});

const mapDispatchToProps = (dispatch) => ({
	logout: bindActionCreators(logout, dispatch),
	addTrades: bindActionCreators(addTrades, dispatch),
	setOrderbook: bindActionCreators(setOrderbook, dispatch),
	setMe: bindActionCreators(setMe, dispatch),
	setBalance: bindActionCreators(setBalance, dispatch),
	setUserOrders: bindActionCreators(setUserOrders, dispatch),
	addOrder: bindActionCreators(addOrder, dispatch),
	updateOrder: bindActionCreators(updateOrder, dispatch),
	removeOrder: bindActionCreators(removeOrder, dispatch),
	addUserTrades: bindActionCreators(addUserTrades, dispatch),
	updateUser: bindActionCreators(updateUser, dispatch),
	closeNotification: bindActionCreators(closeNotification, dispatch),
	closeAllNotification: bindActionCreators(closeAllNotification, dispatch),
	openContactForm: bindActionCreators(openContactForm, dispatch),
	openHelpfulResourcesForm: bindActionCreators(
		openHelpfulResourcesForm,
		dispatch
	),
	setNotification: bindActionCreators(setNotification, dispatch),
	changeLanguage: bindActionCreators(setLanguage, dispatch),
	changePair: bindActionCreators(changePair, dispatch),
	setPairs: bindActionCreators(setPairs, dispatch),
	setPairsData: bindActionCreators(setPairsData, dispatch),
	setOrderbooks: bindActionCreators(setOrderbooks, dispatch),
	setTrades: bindActionCreators(setTrades, dispatch),
	setTickers: bindActionCreators(setTickers, dispatch),
	changeTheme: bindActionCreators(changeTheme, dispatch),
	setChatUnreadMessages: bindActionCreators(setChatUnreadMessages, dispatch),
	setOrderLimits: bindActionCreators(setOrderLimits, dispatch),
	setSnackDialog: bindActionCreators(setSnackDialog, dispatch),
	setCurrencies: bindActionCreators(setCurrencies, dispatch),
	setValidBaseCurrency: bindActionCreators(setValidBaseCurrency, dispatch),
	setConfig: bindActionCreators(setConfig, dispatch),
	setInfo: bindActionCreators(setInfo, dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Container);
