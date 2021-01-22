import React, { Component } from 'react';
import classnames from 'classnames';
import withConfig from 'components/ConfigProvider/withConfig';
import STRINGS from '../../config/localizedStrings';
import { IconTitle, Accordion } from '../../components';

import { ButtonLink, Wallet } from '../';

class SidebarHub extends Component {
	render() {
		const { activePath, isLogged, icons: ICONS } = this.props;
		const values = [
			{
				accordionClassName: 'sidebar_hub-section-content f-1',
				stringId: 'WALLET_TITLE',
				title: STRINGS['WALLET_TITLE'],
				iconId: 'SIDEBAR_WALLET_ACTIVE',
				icon: ICONS['SIDEBAR_WALLET_ACTIVE'],
				content: <Wallet />,
			},
		];
		return (
			<div
				className={classnames(
					'd-flex flex-column sidebar_hub-wrapper',
					`active-${activePath}`
				)}
			>
				<div className="d-flex sidebar_hub-content d-flex flex-column">
					{isLogged ? (
						<div>
							<Accordion sections={values} />
						</div>
					) : (
						<div>
							<IconTitle
								iconId="DEMO_LOGIN_ICON"
								iconPath={ICONS['DEMO_LOGIN_ICON']}
								textType="title"
								className="w-100"
							/>

							<ButtonLink
								label={STRINGS['SIGN_IN'].toUpperCase()}
								className={'log_in-btn'}
								disabled={isLogged}
								link={`/login`}
							/>
							<div className="text-center mt-3 mb-3">{STRINGS['OR_TEXT']}</div>

							<ButtonLink
								label={STRINGS['SIGNUP_TEXT'].toUpperCase()}
								className={'sign_up-btn mb-5'}
								disabled={isLogged}
								link={`/signup`}
							/>
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default withConfig(SidebarHub);
