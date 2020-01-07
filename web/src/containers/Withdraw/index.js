import React, { Component } from 'react';
import classnames from 'classnames';
import math from 'mathjs';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { formValueSelector, change } from 'redux-form';
import { isMobile } from 'react-device-detect';

import { Loader, MobileBarBack } from '../../components';
import {
	ICONS,
	MIN_VERIFICATION_LEVEL_TO_WITHDRAW,
	MAX_VERIFICATION_LEVEL_TO_WITHDRAW
} from '../../config/constants';
import { getCurrencyFromName, roundNumber } from '../../utils/currency';
import {
	performWithdraw,
	requestWithdrawFee
} from '../../actions/walletActions';
import { errorHandler } from '../../components/OtpForm/utils';

import { openContactForm } from '../../actions/appActions';

import WithdrawCryptocurrency from './form';
import { generateFormValues, generateInitialValues } from './formUtils';
import { generateBaseInformation } from './utils';

import { renderInformation, renderTitleSection } from '../Wallet/components';

import { FORM_NAME } from './form';

class Withdraw extends Component {
	state = {
		formValues: {},
		initialValues: {},
		checked: false,
		isControlChecked: true
	};

	componentWillMount() {
		// if (
		// 	this.props.verification_level >= MIN_VERIFICATION_LEVEL_TO_WITHDRAW &&
		// 	this.props.verification_level <= MAX_VERIFICATION_LEVEL_TO_WITHDRAW
		// ) {
		// 	this.props.requestBtcWithdrawFee();
		// 	this.generateFormValues(
		// 		getCurrencyFromName(this.props.routeParams.currency),
		// 		this.props.balance,
		// 		this.props.btcFee
		// 	);
		// }
		if (this.props.verification_level) {
			this.validateRoute(
				this.props.routeParams.currency,
				this.props.bank_account,
				this.props.crypto_wallet,
				this.props.coins
			);
		}
		this.setCurrency(this.props.routeParams.currency);
	}

	componentWillReceiveProps(nextProps) {
		if (!this.state.checked) {
			if (nextProps.verification_level) {
				this.validateRoute(
					nextProps.routeParams.currency,
					nextProps.bank_account,
					nextProps.crypto_wallet,
					nextProps.coins
				);
			}
		} else if (
			nextProps.verification_level >= MIN_VERIFICATION_LEVEL_TO_WITHDRAW &&
			nextProps.verification_level <= MAX_VERIFICATION_LEVEL_TO_WITHDRAW &&
			(nextProps.activeLanguage !== this.props.activeLanguage ||
				nextProps.routeParams.currency !== this.props.routeParams.currency)
		) {
			this.generateFormValues(
				getCurrencyFromName(nextProps.routeParams.currency, nextProps.coins),
				nextProps.balance,
				nextProps.coins,
				nextProps.verification_level
			);
		}
		if (nextProps.routeParams.currency !== this.props.routeParams.currency) {
			this.setCurrency(nextProps.routeParams.currency);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.isControlChecked !== prevState.isControlChecked) {
			this.generateFormValues(
				getCurrencyFromName(this.props.routeParams.currency, this.props.coins),
				this.props.balance,
				this.props.coins,
				this.props.verification_level
			);
		}
	}

	validateRoute = (currency, bank_account, crypto_wallet, coins) => {
		if (coins[currency] && !crypto_wallet[currency]) {
			this.props.router.push('/wallet');
		} else if (currency) {
			this.setState({ checked: true });
		}
	};

	setCurrency = (currencyName) => {
		const currency = getCurrencyFromName(currencyName, this.props.coins);
		if (currency) {
			this.setState({ currency, checked: false }, () => {
				this.validateRoute(
					this.props.routeParams.currency,
					this.props.bank_account,
					this.props.crypto_wallet,
					this.props.coins
				);
			});
			// if (currency === 'btc' || currency === 'bch' || currency === 'eth') {
			// 	this.props.requestWithdrawFee(currency);
			// }

			this.generateFormValues(
				currency,
				this.props.balance,
				this.props.coins,
				this.props.verification_level
			);
		} else {
			this.props.router.push('/wallet');
		}
	};

	generateFormValues = (currency, balance, coins, verification_level) => {
		const balanceAvailable = balance[`${currency}_available`];
		const formValues = generateFormValues(
			currency,
			balanceAvailable,
			this.onCalculateMax,
			coins,
			verification_level,
			this.destinationTagCheckCallback,
			this.state.isControlChecked
		);
		const initialValues = generateInitialValues(currency, coins);

		this.setState({ formValues, initialValues });
	};

	onSubmitWithdraw = (currency) => (values) => {
		const { destination_tag, ...rest } = values;
		let address = rest.address;
		if (destination_tag && this.state.isControlChecked)
			address = `${rest.address}:${destination_tag}`;
		return performWithdraw(currency, {
			...rest,
			address,
			amount: math.eval(values.amount),
			fee: values.fee ? math.eval(values.fee) : 0,
			currency
		})
			.then((response) => {
				return { ...response.data, currency: this.state.currency };
			})
			.catch(errorHandler);
	};

	onCalculateMax = () => {
		const { balance, selectedFee = 0, dispatch } = this.props;
		const { currency } = this.state;
		const balanceAvailable = balance[`${currency}_available`];
		// if (currency === BASE_CURRENCY) {
		// 	const fee = calculateBaseFee(balanceAvailable);
		// 	const amount = math.number(
		// 		math.subtract(math.fraction(balanceAvailable), math.fraction(fee))
		// 	);
		// 	dispatch(change(FORM_NAME, 'amount', math.floor(amount)));
		// } else {
			const amount = math.number(
				math.subtract(
					math.fraction(balanceAvailable),
					math.fraction(selectedFee)
				)
			);
			dispatch(change(FORM_NAME, 'amount', roundNumber(amount, 4)));
		// }
	};

	onGoBack = () => {
		this.props.router.push('/wallet');
	};

	destinationTagCheckCallback = value => {
		this.setState({ isControlChecked: value });
	};

	render() {
		const {
			balance,
			verification_level,
			prices,
			otp_enabled,
			openContactForm,
			activeLanguage,
			router,
			coins
		} = this.props;
		const { formValues, initialValues, currency, checked } = this.state;
		if (!currency || !checked) {
			return <div />;
		}

		const balanceAvailable = balance[`${currency}_available`];

		if (
			verification_level >= MIN_VERIFICATION_LEVEL_TO_WITHDRAW &&
			verification_level <= MAX_VERIFICATION_LEVEL_TO_WITHDRAW &&
			(balanceAvailable === undefined)
		) {
			return <Loader />;
		}

		const formProps = {
			currency,
			onSubmitWithdrawReq: this.onSubmitWithdraw(currency),
			onOpenDialog: this.onOpenDialog,
			otp_enabled,
			openContactForm,
			formValues,
			initialValues,
			activeLanguage,
			balanceAvailable,
			currentPrice: prices[currency],
			router
		};

		return (
			<div>
				{isMobile && <MobileBarBack onBackClick={this.onGoBack}>
				</MobileBarBack> }
				<div className="presentation_container apply_rtl">
					{!isMobile && renderTitleSection(currency, 'withdraw', ICONS.WITHDRAW, coins)}
					{/* // This commented code can be used if you want to enforce user to have a verified bank account before doing the withdrawal
					{verification_level >= MIN_VERIFICATION_LEVEL_TO_WITHDRAW &&
					verification_level <= MAX_VERIFICATION_LEVEL_TO_WITHDRAW ? ( */}
						<div className={classnames('inner_container', 'with_border_top')}>
							{renderInformation(
								currency,
								balance,
								openContactForm,
								generateBaseInformation,
								coins
							)}
							<WithdrawCryptocurrency {...formProps} />
							{/* {renderExtraInformation(currency, bank_account)} */}
						</div>
					{/* // This commented code can be used if you want to enforce user to have a verified bank account before doing the withdrawal
						) : (
						<div className={classnames('inner_container', 'with_border_top')}>
							<WarningVerification level={verification_level} />
						</div>
					)} */}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	prices: store.orderbook.prices,
	balance: store.user.balance,
	fee: store.user.fee,
	verification_level: store.user.verification_level,
	otp_enabled: store.user.otp_enabled,
	bank_account: store.user.userData.bank_account,
	crypto_wallet: store.user.crypto_wallet,
	activeLanguage: store.app.language,
	// btcFee: store.wallet.btcFee,
	selectedFee: formValueSelector(FORM_NAME)(store, 'fee'),
	coins: store.app.coins,
	pairs: store.app.pairs
});

const mapDispatchToProps = (dispatch) => ({
	openContactForm: bindActionCreators(openContactForm, dispatch),
	requestWithdrawFee: bindActionCreators(requestWithdrawFee, dispatch),
	dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(Withdraw);
