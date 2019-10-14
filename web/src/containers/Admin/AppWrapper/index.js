import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout, Menu, Icon, Row, Col, Spin } from 'antd';
import io from 'socket.io-client';
import { debounce } from 'lodash';

import { PATHS } from '../paths';
import {
	removeToken,
	isLoggedIn,
	isSupport,
	isSupervisor,
	isAdmin,
	getTokenTimestamp,
	getToken
} from '../../../utils/token';
import { checkUserSessionExpired } from '../../../utils/utils';
import { logout } from '../../../actions/authAction';
import { setMe } from '../../../actions/userAction';
import {
	setPairsData
} from '../../../actions/orderbookAction';
import {
	setPairs,
	changePair,
	setCurrencies,
	setOrderLimits,
	setValidBaseCurrency,
	setConfig,
	setLanguage,
	changeTheme
} from '../../../actions/appActions';
import { WS_URL, SESSION_TIME, BASE_CURRENCY } from '../../../config/constants';

import MobileDetect from 'mobile-detect';
import MobileSider from './mobileSider';
import './index.css';
import 'antd/dist/antd.css';

const md = new MobileDetect(window.navigator.userAgent);

const { Content, Sider } = Layout;

const renderMenuItem = ({ path, label, ...rest }, index) => (
	<Menu.Item key={index}>
		<Link to={path} className="no-link">
			{label}
		</Link>
	</Menu.Item>
);

class AppWrapper extends React.Component {
	constructor(prop) {
		super(prop);
		this.state = {
			isSupportUser: false,
			isSupervisorUser: false,
			isAdminUser: false,
			isLoaded: false,
			appLoaded: false,
			publicSocket: undefined,
			privateSocket: undefined,
			idleTimer: undefined
		};
	}

	componentWillMount() {
		if (isLoggedIn() && checkUserSessionExpired(getTokenTimestamp())) {
			this.logout('Token is expired');
		}
	}

	componentDidMount() {
		// if (!this.props.fetchingAuth && !Object.keys(this.props.pairs).length) {
		if (!this.props.fetchingAuth) {
			this.initSocketConnections();
		}
		this._resetTimer();
		this.setState({
			isSupportUser: isSupport(),
			isSupervisorUser: isSupervisor(),
			isAdminUser: isAdmin(),
			isLoaded: true
		});
	}

	componentWillReceiveProps(nextProps) {
		// if (
		// 	!nextProps.fetchingAuth &&
		// 	nextProps.fetchingAuth !== this.props.fetchingAuth &&
		// 	!Object.keys(this.props.pairs).length
		// ) {
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
	}

	initSocketConnections = () => {
		this.setPublicWS();
		if (isLoggedIn()) {
			this.setUserSocket(getToken());
		}
		this.setState({ appLoaded: true }, () => {
			this._resetTimer();
		});
	};

	_resetTimer = () => {
		if (this.state.idleTimer) {
			clearTimeout(this.idleTimer);
		}
		if (this.state.appLoaded) {
			const idleTimer = setTimeout(
				() => this.logout('Inactive'),
				SESSION_TIME
			); // no activity will log the user out automatically
			this.setState({ idleTimer });
		}
	};

	resetTimer = debounce(this._resetTimer, 250);

	setPublicWS = () => {
		// TODO change when added more cryptocurrencies

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
			this.props.setConfig(data.config);
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
	};

	isSocketDataReady = () => {
		const { pairs } = this.props;
		return Object.keys(pairs).length;
	};

	logout = (message = '') => {
		this.setState({ appLoaded: false }, () => {
			this.props.logout(typeof message === 'string' ? message : '');
		});
	};

	render() {
		const { children, router } = this.props;
		const logout = () => {
			removeToken();
			router.replace('/login');
		};
		const { isAdminUser, isLoaded, appLoaded } = this.state;

		if (!isLoaded) return null;
		if (!isLoggedIn()) {
			router.replace('/login');
		}
		if (isLoggedIn() && !isAdminUser) {
			router.replace('/summary');
		}
		if (md.phone()) {
			return (
				<Layout>
					<Row>
						<Col span={8}>
							<MobileSider menuItem={renderMenuItem} logout={logout} />
						</Col>

						{/*<Sider style={{width: 100}}>*/}
						{/*<Menu theme="dark" mode="vertical" style={{ lineHeight: '64px' }} className="m-top">*/}
						{/*{PATHS.filter(*/}
						{/*({ hideIfSupport }) => !isSupportUser || !hideIfSupport*/}
						{/*).map(renderMenuItem)}*/}
						{/*<Menu.Item key="logout">*/}
						{/*<div onClick={logout}>*/}
						{/*<Icon type="logout" />LOGOUT*/}
						{/*</div>*/}
						{/*</Menu.Item>*/}
						{/*</Menu>*/}
						{/*</Sider>*/}

						<Col span={16}>
							<Layout>
								<Content style={{ marginLeft: 50, marginTop: 0 }}>
									<div className="content-wrapper">
										{appLoaded && this.isSocketDataReady()
											? children
											: <Spin size="large" className="m-top" />
										}
									</div>
								</Content>
							</Layout>
						</Col>
					</Row>
				</Layout>
			);
		} else {
			return (
				<Layout>
					<Sider>
						<Menu
							theme="dark"
							mode="vertical"
							style={{ lineHeight: '64px' }}
							className="m-top"
						>
							{PATHS.filter(
								({ hideIfSupport, hideIfSupervisor, hideIfKYC }) =>
									// isAdminUser ||
									// (isSupportUser && !hideIfSupport) ||
									// (isSupervisorUser && !hideIfSupervisor) ||
									// (isKYC() && !hideIfKYC)
									true
							).map(renderMenuItem)}
							<Menu.Item>
								<Link to="/summary">
									<Icon type="home" />
									Go To HEX-WEB
								</Link>
							</Menu.Item>
							<Menu.Item key="logout">
								<div onClick={logout}>
									<Icon type="logout" />
									LOGOUT
								</div>
							</Menu.Item>
						</Menu>
					</Sider>
					<Layout>
						<Content>
							<div className="content-wrapper">
								{appLoaded && this.isSocketDataReady()
									? children
									: <Spin size="large" className="m-top" />
								}
							</div>
						</Content>
					</Layout>
				</Layout>
			);
		}
	}
}

const mapStateToProps = (state) => ({
	fetchingAuth: state.auth.fetching,
	pairs: state.app.pairs
});

const mapDispatchToProps = (dispatch) => ({
	changePair: bindActionCreators(changePair, dispatch),
	setPairs: bindActionCreators(setPairs, dispatch),
	setPairsData: bindActionCreators(setPairsData, dispatch),
	setCurrencies: bindActionCreators(setCurrencies, dispatch),
	setConfig: bindActionCreators(setConfig, dispatch),
	setValidBaseCurrency: bindActionCreators(setValidBaseCurrency, dispatch),
	setOrderLimits: bindActionCreators(setOrderLimits, dispatch),
	setMe: bindActionCreators(setMe, dispatch),
	changeLanguage: bindActionCreators(setLanguage, dispatch),
	changeTheme: bindActionCreators(changeTheme, dispatch),
	logout: bindActionCreators(logout, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AppWrapper);
