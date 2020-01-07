import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import classnames from 'classnames';

import STRINGS from '../../config/localizedStrings';
import { ICONS, IS_XHT } from '../../config/constants';

class MenuList extends Component {
	state = {
		isOpen: false
	};

	componentDidMount() {
		document.addEventListener('click', this.onOutsideClick);
	}

	onOutsideClick = (event) => {
		const element = document.getElementById('tab-account-menu');
		if (
			element &&
			event.target !== element &&
			!element.contains(event.target)
		) {
			this.props.closeAccountMenu();
		}
	};

	componentWillUnmount() {
		document.removeEventListener('click', this.onOutsideClick);
	}

	handleAccountMenu = () => {
		this.setState({ isOpen: !this.state.isOpen });
	};

	handleMenu = (path) => {
		this.setState({ isOpen: false });
		this.props.handleMenu(path);
	};

	onHelp = () => {
		this.setState({ isOpen: false });
		this.props.onHelp();
	};

	logout = () => {
		this.setState({ isOpen: false });
		this.props.logout();
	};

	render() {
		const {
			selectedMenu,
			securityPending,
			verificationPending,
			walletPending,
			activePath
		} = this.props;
		const totalPending = IS_XHT
			? securityPending + walletPending
			: securityPending + verificationPending;
		return (
			<>
				<div
					className={classnames('app-bar-account-content', {
						'account-inactive':
							activePath !== 'account' && activePath !== 'wallet'
					})}
					onClick={this.handleAccountMenu}
				>
					<ReactSVG
						path={ICONS.SIDEBAR_ACCOUNT_INACTIVE}
						wrapperClassName="app-bar-account-icon"
					/>
					{!!totalPending && (
						<div className="app-bar-account-notification">{totalPending}</div>
					)}
				</div>
				{this.state.isOpen && (
					<div id="tab-account-menu" className="app-bar-account-menu">
						<div
							className={classnames('app-bar-account-menu-list d-flex', {
								'menu-active':
									activePath === 'account' && selectedMenu === 'summary'
							})}
							onClick={() => this.handleMenu('summary')}
						>
							<div className="notification-content" />
							<ReactSVG
								path={ICONS.TAB_SUMMARY}
								wrapperClassName="app-bar-account-list-icon"
							/>
							{STRINGS.ACCOUNTS.TAB_SUMMARY}
						</div>
						<div
							className={classnames(
								'app-bar-account-menu-list d-flex',
								!!walletPending && IS_XHT
									? {
											'menu-notification-active':
												activePath === 'wallet' && selectedMenu === 'wallet',
											wallet_notification: selectedMenu !== 'wallet'
									  }
									: {
											'menu-active':
												activePath === 'wallet' && selectedMenu === 'wallet'
									  }
							)}
							onClick={() => this.handleMenu('wallet')}
						>
							<div className="notification-content">
								{!!walletPending && IS_XHT && (
									<div
										className={
											selectedMenu === 'wallet'
												? 'app-bar-account-list-notification wallet_selected'
												: 'app-bar-account-list-notification wallet_selected_inactive'
										}
									>
										{walletPending}
									</div>
								)}
							</div>
							<ReactSVG
								path={ICONS.TAB_WALLET}
								wrapperClassName="app-bar-account-list-icon"
							/>
							{STRINGS.ACCOUNTS.TAB_WALLET}
						</div>
						<div
							className={classnames(
								'app-bar-account-menu-list d-flex',
								!!securityPending
									? {
											'menu-notification-active':
												activePath === 'account' && selectedMenu === 'security',
											security_notification: selectedMenu !== 'security'
									  }
									: {
											'menu-active':
												activePath === 'account' && selectedMenu === 'security'
									  }
							)}
							onClick={() => this.handleMenu('security')}
						>
							<div className="notification-content">
								{!!securityPending && (
									<div
										className={
											selectedMenu === 'security'
												? 'app-bar-account-list-notification security_selected'
												: 'app-bar-account-list-notification security_selected_inactive'
										}
									>
										{securityPending}
									</div>
								)}
							</div>
							<ReactSVG
								path={ICONS.TAB_SECURITY}
								wrapperClassName="app-bar-account-list-icon"
							/>
							{STRINGS.ACCOUNTS.TAB_SECURITY}
						</div>
						<div
							className={classnames(
								'app-bar-account-menu-list d-flex',
								!!verificationPending && !IS_XHT
									? {
											'menu-notification-active':
												activePath === 'account' &&
												selectedMenu === 'verification',
											verification_notification: selectedMenu !== 'verification'
									  }
									: {
											'menu-active':
												activePath === 'account' &&
												selectedMenu === 'verification'
									  }
							)}
							onClick={() => this.handleMenu('verification')}
						>
							<div className="notification-content">
								{!!verificationPending && !IS_XHT && (
									<div
										className={
											selectedMenu === 'verification'
												? 'app-bar-account-list-notification verification_selected'
												: 'app-bar-account-list-notification verification_selected_inactive'
										}
									>
										{verificationPending}
									</div>
								)}
							</div>
							<ReactSVG
								path={ICONS.TAB_VERIFY}
								wrapperClassName="app-bar-account-list-icon"
							/>
							{STRINGS.ACCOUNTS.TAB_VERIFICATION}
						</div>
						<div
							className={classnames('app-bar-account-menu-list d-flex', {
								'menu-active':
									activePath === 'account' && selectedMenu === 'settings'
							})}
							onClick={() => this.handleMenu('settings')}
						>
							<div className="notification-content" />
							<ReactSVG
								path={ICONS.TAB_SETTING}
								wrapperClassName="app-bar-account-list-icon"
							/>
							{STRINGS.ACCOUNTS.TAB_SETTINGS}
						</div>
						<div
							className={classnames('app-bar-account-menu-list d-flex', {
								'menu-active':
									activePath === 'account' && selectedMenu === 'help'
							})}
							onClick={this.onHelp}
						>
							<div className="notification-content" />
							<ReactSVG
								path={ICONS.SIDEBAR_HELP}
								wrapperClassName="app-bar-account-list-icon"
							/>
							{STRINGS.LOGIN.HELP}
						</div>

						<div
							className="app-bar-account-menu-list d-flex"
							onClick={this.logout}
						>
							<div className="notification-content" />
							<ReactSVG
								path={ICONS.TAB_SIGNOUT}
								wrapperClassName="app-bar-account-list-icon"
							/>
							{STRINGS.ACCOUNTS.TAB_SIGNOUT}
						</div>
					</div>
				)}
			</>
		);
	}
}

export default MenuList;
