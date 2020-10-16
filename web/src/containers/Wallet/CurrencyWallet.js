import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import {
	IconTitle,
	CurrencyBallWithPrice,
	ButtonLink,
	ActionNotification,
	MobileBarBack
} from '../../components';
import { FLEX_CENTER_CLASSES, DEFAULT_COIN_DATA } from '../../config/constants';
import {
	generateWalletActionsText,
	getCurrencyFromName
} from '../../utils/currency';
import STRINGS from '../../config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

class Wallet extends Component {
	state = {
		currency: ''
	};

	componentWillMount() {
		this.setCurrency(this.props.routeParams.currency);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.routeParams.currency !== this.props.routeParams.currency) {
			this.setCurrency(nextProps.routeParams.currency);
		}
	}

	setCurrency = (currencyName) => {
		const currency = getCurrencyFromName(currencyName, this.props.coins);
		if (currency) {
			this.setState({ currency });
		} else {
			this.props.router.push('/wallet');
		}
	};

	renderWalletHeaderBlock = (symbol, price, balance, coins) => {
		const { icons: ICONS } = this.props;
		const balanceValue = balance[`${symbol}_balance`] || 0;
		const { fullname } = coins[symbol] || DEFAULT_COIN_DATA;
		return (
			<div className="wallet-header_block">
				<div className="wallet-header_block-currency_title">
					{STRINGS.formatString(
						STRINGS["CURRENCY_BALANCE_TEXT"],
						fullname
					)}
					<ActionNotification
						stringId="TRADE_HISTORY"
						text={STRINGS["TRADE_HISTORY"]}
						status="information"
						iconId="BLUE_CLIP"
						iconPath={ICONS["BLUE_CLIP"]}
						onClick={() => {
							this.props.router.push('/transactions');
						}}
					/>
				</div>
				<CurrencyBallWithPrice
					symbol={symbol}
					amount={balanceValue}
					price={price}
				/>
			</div>
		);
	};

	onGoBack = () => {
		this.props.router.push('/wallet');
	};

	render() {
		const { balance, price, coins, icons: ICONS } = this.props;
		const { currency } = this.state;
		if (!currency) {
			return <div />;
		}

		const { depositText, withdrawText } = generateWalletActionsText(currency, coins);

		return (
			<div>
			{isMobile && <MobileBarBack onBackClick={this.onGoBack}>
				</MobileBarBack> }
				<div className="presentation_container apply_rtl">
					<IconTitle
						stringId="WALLET_TITLE"
						text={STRINGS["WALLET_TITLE"]}
						iconId="BITCOIN_WALLET"
						iconPath={ICONS["BITCOIN_WALLET"]}
						useSvg={true}
						textType="title"
					/>
					<div className="wallet-container">
						{this.renderWalletHeaderBlock(currency, price, balance, coins)}
						<div
							className={classnames(...FLEX_CENTER_CLASSES, 'wallet-buttons_action')}
						>
						{
						(coins[currency].allow_deposit)
							? <ButtonLink label={depositText} link={`/wallet/${currency}/deposit`} />
							: null
						}
						<div className="separator" />
							{
							(coins[currency].allow_withdrawal)
								? <ButtonLink label={withdrawText} link={`/wallet/${currency}/withdraw`} />
								: null
							}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	coins: store.app.coins,
	price: store.orderbook.price,
	balance: store.user.balance,
	activeLanguage: store.app.language
});

export default connect(mapStateToProps)(withConfig(Wallet));
