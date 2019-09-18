import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SubmissionError } from 'redux-form';
import { isMobile } from 'react-device-detect';
import { browserHistory } from 'react-router';

import {
	setLanguage,
	changeTheme,
	openContactForm,
	openRiskPortfolioOrderWarning,
	closeNotification
} from '../../actions/appActions';
import { logout } from '../../actions/authAction';
import {
	updateUser,
	setUserData,
	setUsername,
	setUsernameStore
} from '../../actions/userAction';
import {
	IconTitle,
	HeaderSection,
	CustomTabs,
	CustomMobileTabs,
	CustomTabBar,
	MobileTabBar,
	Loader
} from '../../components';
import SettingsForm, { generateFormValues } from './SettingsForm';
import UsernameForm, { generateUsernameFormValues } from './UsernameForm';
import LanguageForm, { generateLanguageFormValues } from './LanguageForm';
import NotificationForm, {
	generateNotificationFormValues
} from './NotificationForm';
import AudioCueForm, { generateAudioCueFormValues } from './AudioForm';
import RiskForm, { generateWarningFormValues } from './RiskForm';

import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';
import { calculateBalancePrice } from '../../utils/currency';

class UserSettings extends Component {
	state = {
		sections: [],
		tabs: [],
		dialogIsOpen: false,
		modalText: '',
		activeTab: 0,
		totalAssets: ''
	};

	componentDidMount() {
		const { user } = this.props;

		if (user.id) {
			this.calculateSections(this.props);
		}
		if (this.props.location.query && this.props.location.query.tab) {
			this.setState(
				{ activeTab: parseInt(this.props.location.query.tab, 10) },
				() => {
					this.updateTabs(this.props, this.state.activeTab);
				}
			);
		} else {
			this.updateTabs(this.props, this.state.activeTab);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.activeLanguage !== this.props.activeLanguage) {
			this.updateTabs(this.props, this.state.activeTab);
		}
		if (
			JSON.stringify(this.props.settings) !==
			JSON.stringify(nextProps.settings)
		) {
			this.updateTabs(nextProps, this.state.activeTab);
		}
		if (
			JSON.stringify(this.props.location.query) !==
				JSON.stringify(nextProps.location.query) &&
			nextProps.location.query &&
			nextProps.location.query.tab
		) {
			this.setState(
				{ activeTab: parseInt(nextProps.location.query.tab, 10) },
				() => {
					this.updateTabs(nextProps, this.state.activeTab);
				}
			);
		}
	}

	componentWillUpdate(nextProps, nextState) {
		if (
			nextProps.user.id !== this.props.user.id ||
			nextProps.price !== this.props.price ||
			nextProps.orders.length !== this.props.orders.length ||
			nextProps.balance.timestamp !== this.props.balance.timestamp ||
			nextProps.activeLanguage !== this.props.activeLanguage
		) {
			this.calculateSections(nextProps);
		}
		if (
			this.state.activeTab !== nextState.activeTab &&
			this.state.activeTab !== -1
		) {
			this.updateTabs(nextProps, nextState.activeTab);
		}
	}

	onAdjustPortfolio = () => {
		this.props.openRiskPortfolioOrderWarning({
			onSubmit: (formProps) => this.onSubmitSettings(formProps, 'risk'),
			initialValues: this.props.settings.risk
		});
	};

	calculateSections = ({ balance, prices }) => {
		const totalAssets = calculateBalancePrice(balance, prices);
		this.setState({ totalAssets: totalAssets });
	};

	updateTabs = ({ username = '', settings = {}, coins = {} }, activeTab) => {
		const formValues = generateFormValues({});
		const usernameFormValues = generateUsernameFormValues(
			settings.chat.set_username
		);
		const languageFormValue = generateLanguageFormValues();
		const notificationFormValues = generateNotificationFormValues();
		const audioFormValues = generateAudioCueFormValues();
		const warningFormValues = generateWarningFormValues();

		const tabs = [
			{
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS.USER_SETTINGS.TITLE_NOTIFICATION}
						icon={ICONS.SETTING_NOTIFICATION_ICON}
					/>
				) : (
					<CustomTabs
						title={STRINGS.USER_SETTINGS.TITLE_NOTIFICATION}
						icon={ICONS.SETTING_NOTIFICATION_ICON}
					/>
				),
				content: activeTab === 0 && (
					<NotificationForm
						onSubmit={(formProps) =>
							this.onSubmitSettings(formProps, 'notification')
						}
						formFields={notificationFormValues}
						initialValues={settings.notification}
					/>
				)
			},
			{
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS.USER_SETTINGS.TITLE_INTERFACE}
						icon={ICONS.SETTING_INTERFACE_ICON}
					/>
				) : (
					<CustomTabs
						title={STRINGS.USER_SETTINGS.TITLE_INTERFACE}
						icon={ICONS.SETTING_INTERFACE_ICON}
					/>
				),
				content: activeTab === 1 && (
					<SettingsForm
						onSubmit={(formProps) =>
							this.onSubmitSettings(formProps, 'interface')
						}
						formFields={formValues}
						initialValues={settings.interface}
					/>
				)
			},
			{
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS.USER_SETTINGS.TITLE_LANGUAGE}
						icon={ICONS.SETTING_LANGUAGE_ICON}
					/>
				) : (
					<CustomTabs
						title={STRINGS.USER_SETTINGS.TITLE_LANGUAGE}
						icon={ICONS.SETTING_LANGUAGE_ICON}
					/>
				),
				content: activeTab === 2 && (
					<LanguageForm
						onSubmit={(formProps) =>
							this.onSubmitSettings(formProps, 'language')
						}
						formFields={languageFormValue}
						initialValues={settings}
					/>
				)
			},
			{
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS.USER_SETTINGS.TITLE_CHAT}
						icon={ICONS.SETTING_CHAT_ICON}
					/>
				) : (
					<CustomTabs
						title={STRINGS.USER_SETTINGS.TITLE_CHAT}
						icon={ICONS.SETTING_CHAT_ICON}
					/>
				),
				content: activeTab === 3 && (
					<UsernameForm
						onSubmit={this.onSubmitUsername}
						formFields={usernameFormValues}
						initialValues={{ username }}
					/>
				)
			},
			{
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS.USER_SETTINGS.TITLE_AUDIO_CUE}
						icon={ICONS.SETTING_AUDIO_ICON}
					/>
				) : (
					<CustomTabs
						title={STRINGS.USER_SETTINGS.TITLE_AUDIO_CUE}
						icon={ICONS.SETTING_AUDIO_ICON}
					/>
				),
				content: activeTab === 4 && (
					<AudioCueForm
						onSubmit={(formProps) =>
							this.onSubmitSettings(formProps, 'audio')
						}
						formFields={audioFormValues}
						initialValues={settings.audio}
					/>
				)
			},
			{
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS.USER_SETTINGS.TITLE_MANAGE_RISK}
						icon={ICONS.SETTING_RISK_ICON}
					/>
				) : (
					<CustomTabs
						title={STRINGS.USER_SETTINGS.TITLE_MANAGE_RISK}
						icon={ICONS.SETTING_RISK_ICON}
					/>
				),
				content: activeTab === 5 && (
					<RiskForm
						coins={coins}
						onAdjustPortfolio={this.onAdjustPortfolio}
						totalAssets={this.state.totalAssets}
						onSubmit={(formProps) =>
							this.onSubmitSettings(formProps, 'risk')
						}
						formFields={warningFormValues}
						initialValues={settings.risk}
					/>
				)
			}
		];

		this.setState({ tabs });
	};

	renderContent = (tabs, activeTab) =>
		tabs[activeTab] && tabs[activeTab].content ? (
			tabs[activeTab].content
		) : (
			<div />
		);

	onSubmitSettings = (formProps, formKey) => {
		let settings = {};
		switch (formKey) {
			case 'notification':
				settings.notification = formProps;
				break;
			case 'interface':
				settings = { ...formProps }; // ToDo: need to be removed after end point update
				settings.interface = formProps;
				break;
			case 'language':
				settings = { ...formProps };
				break;
			case 'chat':
				settings.chat = { ...formProps };
				break;
			case 'audio':
				settings.audio = formProps;
				break;
			case 'risk':
				settings.risk = formProps;
				break;
			default:
		}
		return updateUser({ settings })
			.then(({ data }) => {
				this.props.setUserData(data);
				this.props.changeLanguage(data.settings.language);
				this.props.changeTheme(data.settings.interface.theme);
				this.props.closeNotification();
				localStorage.setItem('theme', data.settings.interface.theme);
			})
			.catch((err) => {
				const _error =
					err.response && err.response.data
						? err.response.data.message
						: err.message;
				throw new SubmissionError({ _error });
			});
	};

	onSubmitUsername = (values) => {
		return setUsername(values)
			.then(() => {
				this.props.setUsernameStore(values.username);
				this.onSubmitSettings({ set_username: true }, 'chat');
			})
			.catch((err) => {
				const _error =
					err.response && err.response.data
						? err.response.data.message
						: err.message;
				throw new SubmissionError({ username: _error });
			});
	};

	logout = (message = '') => {
		this.props.logout(typeof message === 'string' ? message : '');
	};

	openContactForm = () => {
		this.props.openContactForm();
	};

	setActiveTab = (activeTab) => {
		this.setState({ activeTab });
		if (this.props.location.query && this.props.location.query.tab) {
			this.removeQueryString();
		}
	};
	removeQueryString = () => {
		browserHistory.push('/settings');
	};

	render() {
		if (this.props.verification_level === 0) {
			return <Loader />;
		}

		const { activeTab, tabs } = this.state;
		return (
			<div className="presentation_container apply_rtl verification_container">
				{!isMobile && (
					<IconTitle
						text={STRINGS.ACCOUNTS.TAB_SETTINGS}
						textType="title"
					/>
				)}
				<HeaderSection
					title={STRINGS.ACCOUNTS.TAB_SETTINGS}
					openContactForm={this.openContactForm}
				>
					<div className="header-content">
						<div>{STRINGS.USER_SETTINGS.TITLE_TEXT_1}</div>
						<div className="mb-3">
							{STRINGS.USER_SETTINGS.TITLE_TEXT_2}
						</div>
					</div>
				</HeaderSection>
				{!isMobile ? (
					<CustomTabBar
						activeTab={activeTab}
						setActiveTab={this.setActiveTab}
						tabs={tabs}
					/>
				) : (
					<MobileTabBar
						activeTab={activeTab}
						renderContent={this.renderContent}
						setActiveTab={this.setActiveTab}
						tabs={tabs}
					/>
				)}
				{!isMobile ? this.renderContent(tabs, activeTab) : null}
				{isMobile && (
					<div className="my-4">
						{/* <Button label={STRINGS.ACCOUNTS.TAB_SIGNOUT} onClick={this.logout} /> */}
					</div>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	coins: state.app.coins,
	verification_level: state.user.verification_level,
	settings: state.user.settings,
	username: state.user.username,
	activeLanguage: state.app.language,
	balance: state.user.balance,
	prices: state.orderbook.prices,
	user: state.user,
	price: state.orderbook.price,
	orders: state.order.activeOrders
});

const mapDispatchToProps = (dispatch) => ({
	setUsernameStore: bindActionCreators(setUsernameStore, dispatch),
	setUserData: bindActionCreators(setUserData, dispatch),
	changeLanguage: bindActionCreators(setLanguage, dispatch),
	changeTheme: bindActionCreators(changeTheme, dispatch),
	openContactForm: bindActionCreators(openContactForm, dispatch),
	openRiskPortfolioOrderWarning: bindActionCreators(
		openRiskPortfolioOrderWarning,
		dispatch
	),
	closeNotification: bindActionCreators(closeNotification, dispatch),
	logout: bindActionCreators(logout, dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UserSettings);
