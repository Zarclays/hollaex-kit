import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';

import SummaryBlock from './components/SummaryBlock';
import TraderAccounts from './components/TraderAccounts';
import SummaryRequirements from './components/SummaryRequirements';
import AccountAssets from './components/AccountAssets';
import TradingVolume from './components/TradingVolume';
import AccountDetails from './components/AccountDetails';
import MobileSummary from './MobileSummary';

import { IconTitle } from '../../components';
import { openFeesStructureandLimits, openContactForm } from '../../actions/appActions';
import { requestLimits, requestFees } from '../../actions/userAction';
import { SUMMMARY_ICON, CURRENCIES, TRADING_ACCOUNT_TYPE } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import {
    formatFiatAmount,
    calculateBalancePrice,
    formatPercentage,
    calculatePrice,
    calculatePricePercentage } from '../../utils/currency';

const FIAT = CURRENCIES.fiat.symbol;
const default_trader_account = TRADING_ACCOUNT_TYPE.shrimp;

class Summary extends Component {
    state = {
        selectedAccount: default_trader_account.symbol,
        currentTradingAccount: default_trader_account,
        chartData: [],
        totalAssets: '',
        chartBalance: [],
        allData: {}
    };

    
    componentDidMount() {
        const { user, symbol, limits, requestLimits, fees, requestFees } = this.props;
        if (!limits.fetched && !limits.fetching) {
            requestLimits();
        }

        if (!fees.fetched && !fees.fetching) {
            requestFees();
        }

        if (user.id && symbol) {
            this.calculateSections(this.props);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.user.id !== this.props.user.id ||
            nextProps.price !== this.props.price ||
            nextProps.orders.length !== this.props.orders.length ||
            nextProps.balance.timestamp !== this.props.balance.timestamp ||
            nextProps.activeLanguage !== this.props.activeLanguage
        ) {
            this.calculateSections(nextProps);
        }
    }

    onFeesAndLimits = tradingAccount => {
        const { fees, limits, verification_level, pairs } = this.props;
        this.props.openFeesStructureandLimits({
            fees: fees.data,
            limits: limits.data,
            verification_level,
            tradingAccount,
            pairs
        });
    };

    onAccountTypeChange = type => {
        this.setState({ selectedAccount: type });
    };

    onUpgradeAccount = () => {
        this.props.openContactForm({ category: 'level' });
    };

    calculateSections = ({ price, balance, orders, prices }) => {
        const data = [];
        const chartBalance = [];

        const totalAssets = calculateBalancePrice(balance, prices);
        Object.keys(CURRENCIES).forEach((currency) => {
            const { symbol, formatToCurrency } = CURRENCIES[currency];
            const currencyBalance = calculatePrice(balance[`${symbol}_balance`], prices[currency]);
            const balancePercent = calculatePricePercentage(currencyBalance, totalAssets);
            chartBalance.push(balancePercent);
            // if (balancePercent > 0) {
            // } else {
            //     chartBalance.push(0.504);
            // }
            data.push({
                ...CURRENCIES[currency],
                balance: formatToCurrency(currencyBalance),
                balancePercentage: formatPercentage(balancePercent),
            });
        });

        this.setState({ chartData: data, totalAssets: formatFiatAmount(totalAssets), chartBalance });
    };

    render() {
        const { user, balance, activeTheme } = this.props;
        const { selectedAccount, currentTradingAccount, chartData, chartBalance, totalAssets } = this.state;
        return (
            <div className="summary-container">
                {/* <IconTitle
                    text={`${STRINGS.ACCOUNTS.TITLE} ${STRINGS.SUMMARY.TITLE}`}
                    textType="title"
                /> */}
                {isMobile
                    ? <MobileSummary
                        user={user}
                        activeTheme={activeTheme}
                        default_trader_account={default_trader_account}
                        currentTradingAccount={currentTradingAccount}
                        selectedAccount={selectedAccount}
                        FIAT={FIAT}
                        balance={balance}
                        onFeesAndLimits={this.onFeesAndLimits}
                        onUpgradeAccount={this.onUpgradeAccount}
                        onAccountTypeChange={this.onAccountTypeChange}
                    />
                    : (<div>
                        <div className="d-flex align-items-center">
                            <div className="summary-section_1 trader-account-wrapper d-flex">
                                <SummaryBlock title={STRINGS.SUMMARY.TINY_PINK_SHRIMP_TRADER_ACCOUNT} >
                                    <TraderAccounts
                                        icon={SUMMMARY_ICON.SHRIMP}
                                        activeTheme={activeTheme}
                                        account={default_trader_account}
                                        onFeesAndLimits={this.onFeesAndLimits}
                                        onUpgradeAccount={this.onUpgradeAccount} />
                                </SummaryBlock>
                            </div>
                            <div className="summary-section_1 requirement-wrapper d-flex">
                                <SummaryBlock
                                    title={STRINGS.SUMMARY.URGENT_REQUIREMENTS}
                                    wrapperClassname="w-100" >
                                    <SummaryRequirements user={user} contentClassName="requirements-content" />
                                </SummaryBlock>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="assets-wrapper">
                                <SummaryBlock
                                    title={STRINGS.SUMMARY.ACCOUNT_ASSETS}
                                    secondaryTitle={<span><span className="title-font">{totalAssets}</span>{` ${STRINGS.FIAT_FULLNAME}`}</span>} >
                                    <AccountAssets
                                        user={user}
                                        chartData={chartData}
                                        chartBalance={chartBalance}
                                        totalAssets={totalAssets}
                                        balance={balance} />
                                </SummaryBlock>
                            </div>
                            <div className="trading-volume-wrapper">
                                <SummaryBlock
                                    title={STRINGS.SUMMARY.TRADING_VOLUME}
                                    secondaryTitle={`${balance[`${FIAT}_balance`]} ${STRINGS.FIAT_FULLNAME}`} >
                                    <TradingVolume user={user} />
                                </SummaryBlock>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <SummaryBlock
                                title={STRINGS.SUMMARY.ACCOUNT_DETAILS}
                                secondaryTitle={currentTradingAccount.name}
                                wrapperClassname="w-100" >
                                <AccountDetails
                                    user={user}
                                    activeTheme={activeTheme}
                                    currentTradingAccount={currentTradingAccount.symbol}
                                    selectedAccount={selectedAccount}
                                    onAccountTypeChange={this.onAccountTypeChange}
                                    onFeesAndLimits={this.onFeesAndLimits} />
                            </SummaryBlock>
                        </div>
                    </div>)
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    pairs: state.app.pairs,
    user: state.user,
    verification_level: state.user.verification_level,
    balance: state.user.balance,
    fees: state.user.feeValues,
    limits: state.user.limits,
    activeTheme: state.app.theme,
    prices: state.orderbook.prices,
    symbol: state.orderbook.symbol,
    price: state.orderbook.price,
    orders: state.order.activeOrders,
    activeLanguage: state.app.language
});

const mapDispatchToProps = (dispatch) => ({
    requestLimits: bindActionCreators(requestLimits, dispatch),
    requestFees: bindActionCreators(requestFees, dispatch),
    openFeesStructureandLimits: bindActionCreators(openFeesStructureandLimits, dispatch),
    openContactForm: bindActionCreators(openContactForm, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Summary);

