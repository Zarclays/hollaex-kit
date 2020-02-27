import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import * as d3 from 'd3-selection';
import {
	// AppBar,
	CustomTabs,
	CustomMobileTabs,
	Dialog,
	Loader,
	// Logout,
	Notification,
	// MobileBarTabs,
	PanelInformationRow
} from '../../components';
import { ICONS, SUPPORT_HELP_URL } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import {
	requestSmsCode,
	verifySmsCode,
	verifyBankData
} from '../../actions/verificationActions';
import { logout } from '../../actions/authAction';

import BankVerification from './BankVerification';
import { isBrowser, isMobile } from 'react-device-detect';
import VerificationHome from './VerificationHome';
import IdentityVerification from './IdentityVerification';
import MobileVerification from './MobileVerification';
import DocumentsVerification from './DocumentsVerification';
import {
	mobileInitialValues,
	identityInitialValues,
	documentInitialValues
} from './utils';
import {
	getClasesForLanguage,
	getFontClassForLanguage
} from '../../utils/string';
import { ContactForm } from '../';
import { NOTIFICATIONS } from '../../actions/appActions';
import { setMe } from '../../actions/userAction';
import { getThemeClass } from '../../utils/theme';
import BankVerificationHome from './BankVerificationHome';
import IdentityVerificationHome from './IdentityVerificationHome';
import MobileVerificationHome from './MobileVerificationHome';
import DocumentsVerificationHome from './DocumentsVerificationHome';
// import MobileTabs from './MobileTabs';

// const CONTENT_CLASS =
// 	'd-flex justify-content-center align-items-center f-1 flex-column verification_content-wrapper';

class Verification extends Component {
	state = {
		activeTab: -1,
		tabs: [],
		currentTabs: [],
		dialogIsOpen: false,
		user: {},
		activePage: 'email'
	};

	componentDidMount() {
		if (this.props.user) {
			this.setUserData(this.props.user);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.user.email !== this.props.user.email ||
			nextProps.user.phone_number !== this.props.user.phone_number ||
			JSON.stringify(nextProps.user.address) !== JSON.stringify(this.props.user.address) ||
			JSON.stringify(nextProps.user.id_data) !== JSON.stringify(this.props.user.id_data)) {
				this.setUserData(nextProps.user);
		}
		if (nextProps.activeLanguage !== this.props.activeLanguage) {
			this.updateTabs(this.state.user, nextProps.activeLanguage);
		}
	}

	componentWillUpdate(nextProps, nextState) {
		if (
			this.state.activeTab !== nextState.activeTab &&
			this.state.activeTab !== -1
		) {
			this.updateTabs(
				nextState.user,
				nextProps.activeLanguage,
				nextState.activeTab
			);
		}
	}

	setUserData = (user = {}) => {
		const calculatedData = this.calculateActiveTab(user);
		if (calculatedData.activeTab > 4) {
			this.goToAccountPage();
		} else {
			this.updateTabs(
				user,
				this.props.activeLanguage,
				calculatedData.activeTab,
				calculatedData.currentTabs
			);
			this.setState({
				user,
				activeTab: calculatedData.activeTab,
				currentTabs: calculatedData.currentTabs
			});
		}
	};

	calculateActiveTab = ({
		email,
		bank_account,
		address,
		phone_number,
		id_data,
		full_name
	}) => {
		const { enabledPlugins } = this.props;
		let currentTabs = ['email'];
		if (enabledPlugins.length) {
			currentTabs = [ ...currentTabs, ...enabledPlugins ];
		}
		if (enabledPlugins.includes('kyc')) {
			currentTabs = [ ...currentTabs, 'document' ];
		}
		let activeTab = 0;
		if (!email && currentTabs.indexOf('email') !== -1) {
			activeTab = currentTabs.indexOf('email');
		} else if (!bank_account.length && currentTabs.indexOf('bank') !== -1) {
			activeTab = currentTabs.indexOf('bank');
		} else if (!address.country && currentTabs.indexOf('kyc') !== -1) {
			activeTab = currentTabs.indexOf('kyc');
		} else if (!phone_number && currentTabs.indexOf('sms') !== -1) {
			activeTab = currentTabs.indexOf('sms');
		} else if (!id_data.provided && currentTabs.indexOf('document') !== -1) {
			activeTab = currentTabs.indexOf('document');
		}
		return { activeTab, currentTabs };
	};

	updateTabs = (
		user = {},
		activeLanguage = this.props.activeLanguage,
		activeTab = this.state.activeTab,
		currentTabs = this.state.currentTabs
	) => {
		if (activeTab === -1) {
			return;
		}
		const { email, bank_account, address, id_data, phone_number } = user;
		let bank_status = 0;
		if (bank_account.length) {
			if (bank_account.filter(data => data.status === 3).length) {
				bank_status = 3;
			} else if (bank_account.filter(data => data.status === 1).length) {
				bank_status = 1;
			} else if (bank_account.filter(data => data.status === 2).length) {
				bank_status = 2;
			}
			if (id_data.status !== 3) {
				bank_status = 1;
			}
			if (bank_account.length === bank_account.filter(data => data.status === 0).length) {
				bank_status = 0;
			}
		}
		const identity_status = address.country 
			? id_data.status && id_data.status === 3
				? 3
				: 1
			: 1;
		const tabUtils = {
			email: {
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS.USER_VERIFICATION.TITLE_EMAIL}
						icon={ICONS.VERIFICATION_EMAIL_NEW}
						statusCode={email ? 3 : 0}
					/>
				) : (
					<CustomTabs
						title={STRINGS.USER_VERIFICATION.TITLE_EMAIL}
						icon={ICONS.VERIFICATION_EMAIL_NEW}
						statusCode={email ? 3 : 0}
					/>
				),
				content: activeTab === 0 && (
					<div>
						<PanelInformationRow
							label={STRINGS.USER_VERIFICATION.MY_EMAIL}
							information={email}
							className={'title-font'}
							disable
						/>
					</div>
				)
			},
			bank: {
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS.USER_VERIFICATION.TITLE_BANK}
						icon={ICONS.VERIFICATION_BANK_NEW}
						statusCode={bank_status}
					/>
				) : (
					<CustomTabs
						title={STRINGS.USER_VERIFICATION.TITLE_BANK}
						icon={ICONS.VERIFICATION_BANK_NEW}
						statusCode={bank_status}
					/>
				),
				content: (<BankVerificationHome
							user={user}
							handleBack={this.handleBack}
							setActivePageContent={this.setActivePageContent}
						/>
				)
			},
			kyc: {
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS.USER_VERIFICATION.TITLE_IDENTITY}
						icon={ICONS.VERIFICATION_ID_NEW}
						statusCode={identity_status}
					/>
				) : (
					<CustomTabs
						title={STRINGS.USER_VERIFICATION.TITLE_IDENTITY}
						icon={ICONS.VERIFICATION_ID_NEW}
						statusCode={identity_status}
					/>
				),
				content: (
					<IdentityVerificationHome
						user={user}
						handleBack={this.handleBack}
						setActivePageContent={this.setActivePageContent}
					/>
				)
			},
			sms: {
				title: isMobile ? (
					<CustomMobileTabs
						title={
							STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION
								.TITLE_PHONE
						}
						icon={ICONS.VERIFICATION_PHONE_NEW}
						statusCode={!phone_number ? 0 : 3}
					/>
				) : (
					<CustomTabs
						title={
							STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION
								.TITLE_PHONE
						}
						icon={ICONS.VERIFICATION_PHONE_NEW}
						statusCode={!phone_number ? 0 : 3}
					/>
				),
				content: (
					<MobileVerificationHome
						user={user}
						setActivePageContent={this.setActivePageContent}
					/>
				)
			},
			document: {
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS.USER_VERIFICATION.TITLE_ID_DOCUMENTS}
						icon={ICONS.VERIFICATION_DOCUMENT_NEW}
						statusCode={id_data.status}
					/>
				) : (
					<CustomTabs
						title={STRINGS.USER_VERIFICATION.TITLE_ID_DOCUMENTS}
						icon={ICONS.VERIFICATION_DOCUMENT_NEW}
						statusCode={id_data.status}
					/>
				),
				content: (
					<DocumentsVerificationHome
						user={user}
						setActivePageContent={this.setActivePageContent}
					/>
				)
			}
		};
		let tabs = currentTabs.map((key) => {
			return tabUtils[key];
		});

		this.setState({ tabs, activeTab });
	};

	goNextTab = (type, data) => {
		let user = { ...this.state.user };
		if (type === 'bank') {
			user.bank_account = [...data.bank_data];
		} else if (type === 'identity') {
			user = {
				...this.state.user,
				...data
			};
		} else if (type === 'mobile') {
			user.phone_number = data.phone;
		} else if (type === 'documents') {
			user.id_data = { ...data };
		}
		const activeTab = this.state.activeTab;
		this.props.setMe(user);
		this.setState({ user, activeTab }, () => {
			if (activeTab >= this.state.tabs.length) {
				this.setState({ dialogIsOpen: true, dialogType: 'complete' });
			} else {
				this.updateTabs(user, this.props.activeLanguage);
			}
		});
	};

	goToAccountPage = () => this.props.router.push('/account');
	goToExir = () => this.props.router.push('/account');

	setActiveTab = (activeTab, event) => {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		this.setState({ activeTab });
	};

	handleBack = (tabKey, event) => {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		if (tabKey) {
			let activeTab = this.state.currentTabs.indexOf(tabKey);
			activeTab = activeTab >= 0 ? activeTab : 0;
			this.setState({ activeTab });
		}
	};

	setActivePageContent = (activePage) => {
		this.setState({ activePage });
	};

	renderContent = (tabs, activeTab) => tabs[activeTab].content || <div>c</div>;

	renderPageContent = (tabProps) => {
		const { activePage, activeTab, tabs, user } = this.state;
		const { activeLanguage } = this.props;
		switch (activePage) {
			case 'email':
				return (
					<VerificationHome
						activeTab={activeTab}
						tabProps={tabProps}
						tabs={tabs}
						openContactForm={this.openContactForm}
						setActiveTab={this.setActiveTab}
						renderContent={this.renderContent}
					/>
				);
			case 'bank':
				return (
					<BankVerification
						icon={ICONS.VERIFICATION_BANK_NEW}
						openContactForm={this.openContactForm}
						setActivePageContent={this.setActivePageContent}
						handleBack={this.handleBack}
						moveToNextStep={this.goNextTab}
					/>
				);
			case 'kyc':
				return (
					<IdentityVerification
						icon={ICONS.VERIFICATION_BANK_NEW}
						fullName={user.full_name}
						moveToNextStep={this.goNextTab}
						activeLanguage={activeLanguage}
						initialValues={identityInitialValues(user)}
						openContactForm={this.openContactForm}
						setActivePageContent={this.setActivePageContent}
						handleBack={this.handleBack}
					/>
				);
			case 'sms':
				return (
					<MobileVerification
						initialValues={mobileInitialValues(user.address)}
						moveToNextStep={this.goNextTab}
						activeLanguage={activeLanguage}
						openContactForm={this.openContactForm}
						handleBack={this.handleBack}
						setActivePageContent={this.setActivePageContent}
					/>
				);
			case 'document':
				return (
					<DocumentsVerification
						nationality={user.nationality}
						idData={user.id_data}
						initialValues={documentInitialValues(user)}
						moveToNextStep={this.goNextTab}
						skip={this.skip}
						activeLanguage={activeLanguage}
						openContactForm={this.openContactForm}
						handleBack={this.handleBack}
						setActivePageContent={this.setActivePageContent}
					/>
				);
			default:
				return;
		}
	};

	onCloseDialog = () => this.setState({ dialogIsOpen: false });

	skip = () => {
		this.setState({ dialogIsOpen: true, dialogType: 'skip' });
	};

	openContactForm = () => {
		if (window) {
			window.open(SUPPORT_HELP_URL, '_blank');
		}
		// this.setState({ dialogIsOpen: true, dialogType: 'contact' });
	};
	renderDialogContent = (type) => {
		switch (type) {
			case 'skip':
			case 'complete':
				const data = {
					type,
					onClick: this.goToExir
				};
				return <Notification type={NOTIFICATIONS.VERIFICATION} data={data} />;
			case 'contact':
				return (
					<ContactForm
						initialValues={{ category: 'verify' }}
						onSubmitSuccess={this.onCloseDialog}
						onClose={this.onCloseDialog}
					/>
				);
			default:
				return <div />;
		}
	};

	onLogout = () => this.props.logout('');

	render() {
		const { activeLanguage, activeTheme } = this.props;
		const { activeTab, tabs, dialogIsOpen, dialogType } = this.state;
		if (activeTab === -1 && tabs.length > 0) {
			return (
				<div className="app_container">
					<Loader />
				</div>
			);
		}

		const languageClasses = getClasesForLanguage(activeLanguage, 'array');
		const fontClass = getFontClassForLanguage(activeLanguage);
		const tabProps = {
			tabs: activeTab < tabs.length ? tabs : [],
			title: STRINGS.ACCOUNTS.TAB_VERIFICATION,
			titleIcon: ICONS.ID_GREY
		};
		return (
			<div
				className={classnames(
					'app_container-main',
					'my-3',
					getThemeClass(activeTheme),
					fontClass,
					languageClasses[0],
					{
						'layout-mobile': isMobile,
						'layout-desktop': isBrowser
					}
				)}
			>
				{/* {!isMobile && <AppBar
					isHome={true}
					token={token}
					theme={activeTheme}
					router={router}
					location={location}
					user={user}
					logout={this.onLogout}
					rightChildren={
						<Logout
							className="sidebar-row bar-logout"
							onLogout={this.onLogout}
						/>
					}
				/>} */}
				{/* {isMobile && <MobileTabBar {...tabProps} activeTab={activeTab} setActiveTab={this.setActiveTab} />} */}
				{this.renderPageContent(tabProps)}
				<Dialog
					isOpen={dialogIsOpen}
					label="hollaex--verification-modal"
					onCloseDialog={this.onCloseDialog}
					shouldCloseOnOverlayClick={dialogType !== 'complete'}
					showCloseText={false}
					theme={activeTheme}
				>
					{this.renderDialogContent(dialogType)}
				</Dialog>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	activeLanguage: state.app.language,
	token: state.auth.token,
	activeTheme: state.app.theme,
	fetchingAuth: state.auth.fetching,
	user: state.user,
	enabledPlugins: state.app.enabledPlugins
});

const mapDispatchToProps = (dispatch) => ({
	requestSmsCode: bindActionCreators(requestSmsCode, dispatch),
	verifySmsCode: bindActionCreators(verifySmsCode, dispatch),
	verifyBankData: bindActionCreators(verifyBankData, dispatch),
	setMe: bindActionCreators(setMe, dispatch),
	logout: bindActionCreators(logout, dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Verification);
