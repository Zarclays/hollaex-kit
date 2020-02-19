import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import EventListener from 'react-event-listener';
import { bindActionCreators } from 'redux';
import { isBrowser, isMobile } from 'react-device-detect';
import moment from 'moment';

import { AppBar, AppFooter } from '../../components';
import STRINGS from '../../config/localizedStrings';
import {
	FLEX_CENTER_CLASSES,
	EXCHANGE_EXPIRY_DAYS,
	EXCHANGE_EXPIRY_SECONDS
} from '../../config/constants';
// import { requestQuickTrade } from '../../actions/orderbookAction';
import { setLanguage, getExchangeInfo } from '../../actions/appActions';
import { logout } from '../../actions/authAction';
import { getClasesForLanguage } from '../../utils/string';
import { getThemeClass } from '../../utils/theme';

import Section1 from './Section1';
// import Section2 from './Section2';
import Section3 from './Section3';

const INFORMATION_INDEX = 1;
const MIN_HEIGHT = 450;

class Home extends Component {
	state = {
		height: 0,
		style: {
			minHeight: MIN_HEIGHT
		}
	};

	componentDidMount() {
		this.props.getExchangeInfo();
	}

	setContainerRef = (el) => {
		if (el) {
			this.container = el;
			this.onResize();
		}
	};

	onResize = () => {
		if (this.container) {
			const height = window.innerHeight - 45;
			this.setState({
				style: {
					minHeight: height
					// maxHeight: height,
				},
				height
			});
			// this.onClickScrollTo(0)();
		}
	};

	onClickScrollTo = (children = 0) => () => {
		if (this.container && typeof children === 'number') {
			const sections = this.container.children;
			if (children < sections.length) {
				sections[children].scrollIntoView({
					behavior: 'smooth'
				});
			}
		}
	};

	goTo = (path) => () => {
		this.props.router.push(path);
	};

	// onReviewQuickTrade = () => {
	// 	if (this.props.token) {
	// 		this.goTo('quick-trade')();
	// 	} else {
	// 		this.goTo('login')();
	// 	}
	// };

	onChangeLanguage = (language) => () => {
		return this.props.changeLanguage(language);
	};

	onLogout = () => this.props.logout('');

	render() {
		const {
			token,
			verifyToken,
			pair,
			// symbol,
			// quickTradeData,
			// requestQuickTrade,
			activeLanguage,
			router,
			info,
			activeTheme
		} = this.props;
		const { style } = this.state;
		const isExpired =
			info &&
			(!Object.keys(info).length || !info.active||
				moment().diff(info.created_at, 'seconds') > EXCHANGE_EXPIRY_SECONDS)
				? true
				: false;
		const expiryDays =
			info && info.created_at
				? EXCHANGE_EXPIRY_DAYS - moment().diff(info.created_at, 'days')
				: 0;
		return (
			<div
				className={classnames(
					'app_container',
					'home_container',
					'app_background',
					getClasesForLanguage(activeLanguage),
					getThemeClass(activeTheme),
					{
						'layout-mobile': isMobile,
						'layout-desktop': isBrowser
					}
				)}
			>
				<EventListener target="window" onResize={this.onResize} />
				<AppBar
					noBorders={true}
					isHome={true}
					token={token}
					verifyToken={verifyToken}
					router={router}
					logout={this.onLogout}
				/>
				{info.is_trial || !Object.keys(info).length ? (
					<div
						className={classnames('w-100', 'p-1', ...FLEX_CENTER_CLASSES, {
							'exchange-trial': info.is_trial,
							'exchange-expired': isExpired
						})}
					>
						{isExpired
							? STRINGS.EXPIRY_EXCHANGE_MSG
							: STRINGS.formatString(
									STRINGS.TRIAL_EXCHANGE_MSG,
									STRINGS.APP_TITLE,
									expiryDays
							  )}
					</div>
				) : null}
				<div
					className={classnames(
						'app_container-content',
						'home_container-content',
						'flex-column',
						'overflow-y'
					)}
					ref={this.setContainerRef}
				>
					<Section1
						style={{
							minHeight:
								style.minHeight > MIN_HEIGHT ? style.minHeight : MIN_HEIGHT
						}}
						onClickScrollTo={this.onClickScrollTo(INFORMATION_INDEX)}
						onClickLearnMore={this.onClickScrollTo(INFORMATION_INDEX)}
						token={token}
					/>
					{/*<Section2
						style={style}
						onReviewQuickTrade={this.onReviewQuickTrade}
						onRequestMarketValue={requestQuickTrade}
						symbol={symbol}
						quickTradeData={quickTradeData}
					/>*/}
					<Section3
						style={style}
						token={token}
						onClickDemo={
							pair ? this.goTo(`trade/${pair}`) : this.goTo('trade/add/tabs')
						}
					/>
					<AppFooter
						theme={activeTheme}
						onChangeLanguage={this.onChangeLanguage}
						activeLanguage={activeLanguage}
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	pair: store.app.pair,
	token: store.auth.token,
	verifyToken: store.auth.verifyToken,
	estimatedValue: 100,
	// symbol: store.orderbook.symbol,
	// quickTradeData: store.orderbook.quickTrade,
	activeLanguage: store.app.language,
	info: store.app.info,
	activeTheme: store.app.theme
});

const mapDispatchToProps = (dispatch) => ({
	// requestQuickTrade: bindActionCreators(requestQuickTrade, dispatch),
	changeLanguage: bindActionCreators(setLanguage, dispatch),
	logout: bindActionCreators(logout, dispatch),
	getExchangeInfo: bindActionCreators(getExchangeInfo, dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Home);
