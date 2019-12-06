import React from 'react';
import classnames from 'classnames';

import TraderAccounts from './TraderAccounts';
import SummaryRequirements, { getRequirements } from './SummaryRequirements';

import STRINGS from '../../../config/localizedStrings';

const AccountTypeDetails = ({
	user,
	coins,
	pairs,
	className = '',
	activeTheme,
	selectedAccount,
	lastMonthVolume,
	onFeesAndLimits,
	onUpgradeAccount,
	verification_level
}) => {
	let isAccountDetails = true;
	const currentAccount = selectedAccount;
	const selectedLevel = isAccountDetails
		? currentAccount || user.verification_level
		: 2;
	const requirement = getRequirements(user, selectedLevel, lastMonthVolume, coins);
	return (
		<div className={classnames(className, 'mx-auto')}>
			<TraderAccounts
				coins={coins}
				pairs={pairs}
				activeTheme={activeTheme}
				account={currentAccount}
				isAccountDetails={true}
				onFeesAndLimits={onFeesAndLimits}
				verification_level={currentAccount}
				selectedAccount={currentAccount}
			/>
			{
				Object.keys(requirement).length ? (
					<div>
						<div className="requirement-header d-flex justify-content-between">
							<div>
								{selectedLevel === 3
									? STRINGS.SUMMARY.ONE_REQUIREMENT
									: STRINGS.SUMMARY.REQUIREMENTS
								}
							</div>
							<div className="status-header">{STRINGS.STATUS}</div>
						</div>
						<SummaryRequirements
							user={user}
							coins={coins}
							isAccountDetails={true}
							verificationLevel={currentAccount}
							lastMonthVolume={lastMonthVolume}
							onUpgradeAccount={onUpgradeAccount}
							contentClassName="w-100"
						/>
					</div>
				) : null}
		</div>
	);
};

export default AccountTypeDetails;
