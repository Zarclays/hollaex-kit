import React from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';

import STRINGS from '../../config/localizedStrings';
import AccountTypeDetails from './components/AccountTypeDetails';
import { ICONS, FLEX_CENTER_CLASSES } from '../../config/constants';

const MobileAccountTypeList = ({
    user,
    coins,
    config,
    activeTheme,
    selectedAccount,
    lastMonthVolume,
    onAccountTypeChange,
    onFeesAndLimits,
    onUpgradeAccount,
    verification_level,
    balance
}) => {
    return (
        <div className="mobile-account-type my-4">
            {config.map((key, index) => {
                return (
                    <div
                        key={index}
                        className={
                            classnames(
                                "account-type-menu",
                                {
                                    "account-type-menu-active": selectedAccount === key,
                                    "accounnt-type-menu-last-active": index === (config.length - 1)
                                }
                            )
                        }
                        onClick={() => onAccountTypeChange(key)}
                    >
                        {selectedAccount !== key
                            ? <div className="d-flex">
                                <div className="mr-4">
                                    <ReactSVG
                                        path={ICONS[`LEVEL_ACCOUNT_ICON_${key}`]
                                            ? ICONS[`LEVEL_ACCOUNT_ICON_${key}`]
                                            : ICONS.LEVEL_ACCOUNT_ICON_4}
                                        wrapperClassName="trader-account-icon"
                                    />
                                </div>
                                <div className={classnames(FLEX_CENTER_CLASSES)}>
                                    {STRINGS.formatString(STRINGS.SUMMARY.LEVEL_OF_ACCOUNT, key)}
                                    {(key === verification_level) &&
                                        <div className="account-current summary-content-txt ml-2"> {`(${STRINGS.SUMMARY.CURRENT_TXT})`} </div>
                                    }
                                </div>
                            </div>
                            : null
                        }
                        {key === selectedAccount
                            && <div className="my-4">
                                <AccountTypeDetails
                                    user={user}
                                    coins={coins}
                                    balance={balance}
                                    activeTheme={activeTheme}
                                    selectedAccount={selectedAccount}
                                    lastMonthVolume={lastMonthVolume}
                                    onFeesAndLimits={onFeesAndLimits}
                                    onUpgradeAccount={onUpgradeAccount} />
                            </div>
                        }
                    </div>
                )
            })}
        </div>
    );
};

export default MobileAccountTypeList;