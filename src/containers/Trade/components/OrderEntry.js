import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { formValueSelector, submit, change } from 'redux-form';
import mathjs from 'mathjs';

import Review from './OrderEntryReview';
import Form, { FORM_NAME } from './OrderEntryForm';
import {
	formatNumber,
	formatFiatAmount,
	roundNumber
} from '../../../utils/currency';
import {
	evaluateOrder,
	required,
	minValue,
	maxValue,
	checkMarketPrice,
	step,
	normalizeInt,
	normalizeFloat
} from '../../../components/Form/validations';
import { Loader, MobileDropdown } from '../../../components';
import { LIMIT_VALUES, CURRENCIES } from '../../../config/constants';

import STRINGS from '../../../config/localizedStrings';

const FIAT_NAME = CURRENCIES.fiat.shortName;

class OrderEntry extends Component {
	state = {
		formValues: {},
		initialValues: {
			side: STRINGS.SIDES[0].value,
			type: STRINGS.TYPES[1].value
		},
		orderPrice: 0,
		orderFees: 0,
		outsideFormError: ''
	};

	componentDidMount() {
		if (this.props.pair_base) {
			this.generateFormValues(this.props.pair_base);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (
			nextProps.size !== this.props.size ||
			nextProps.side !== this.props.side ||
			nextProps.price !== this.props.price ||
			nextProps.type !== this.props.type ||
			nextProps.activeLanguage !== this.props.activeLanguage
		) {
			this.calculateOrderPrice(nextProps);
		}
		if (nextProps.activeLanguage !== this.props.activeLanguage) {
			this.generateFormValues(nextProps.pair_base);
		}
		if (nextProps.marketPrice && !this.state.initialValues.price) {
			this.setState({
				initialValues: {
					...this.state.initialValues,
					price: this.props.marketPrice
				}
			});
		}
	}

	setMax = () => {
		const { side, balance, pair_base } = this.props;
		const size = parseFloat(this.props.size || 0);
		const price = parseFloat(this.props.price || 0);
		let maxSize = balance[`${pair_base}_available`];
		if (side === 'buy') {
			maxSize = mathjs.divide(balance[`fiat_available`], price) ;
		}
		if (maxSize !== size) {
			this.props.change(FORM_NAME, 'size', roundNumber(maxSize, 4));
		}
	};

	calculateOrderPrice = (props) => {
		const { type, side, fees } = props;
		const size = parseFloat(props.size || 0);
		const price = parseFloat(props.price || 0);

		let orderPrice = 0;
		if (size >= LIMIT_VALUES[this.props.pair_base].SIZE.MIN && !(type === 'limit' && price === 0)) {
			if (props.side === 'sell') {
				const { bids } = props;
				orderPrice = checkMarketPrice(size, bids, type, side, price);
			} else {
				const { asks } = props;
				orderPrice = checkMarketPrice(size, asks, type, side, price);
			}
		}

		let orderFees = mathjs
			.chain(orderPrice)
			.multiply(fees.taker_fee)
			.divide(100)
			.done();
		let outsideFormError = '';

		if (type === 'market' && orderPrice === 0 && size >= LIMIT_VALUES[this.props.pair_base].SIZE.MIN) {
			outsideFormError = STRINGS.QUICK_TRADE_ORDER_NOT_FILLED;
		} else if (type === 'market' && side === 'buy') {
			const values = {
				size,
				side,
				type,
				price
			};
			const { pair_base, balance } = props;

			outsideFormError = evaluateOrder(
				pair_base,
				balance,
				values,
				type,
				side,
				orderPrice
			);
		}

		this.setState({ orderPrice, orderFees, outsideFormError });
	};

	evaluateOrder = (values) => {
		const { side, type } = values;
		const { pair_base, balance } = this.props;
		return evaluateOrder(pair_base, balance, values, type, side);
	};

	onSubmit = (values) => {
		const order = {
			...values,
			size: formatNumber(values.size, 4),
			symbol: this.props.pair
		};

		if (values.type === 'market') {
			delete order.price;
		} else if (values.price) {
			order.price = formatNumber(values.price);
		}

		return this.props.submitOrder(order).then(() => {
			this.setState({ initialValues: values });
		});
	};

	onReview = () => {
		const {
			showPopup,
			type,
			side,
			price,
			size,
			pair_base,
			openCheckOrder,
			submit
		} = this.props;
		const order = {
			type,
			side,
			price,
			size: formatNumber(size, 4),
			symbol: pair_base,
			orderPrice: this.state.orderPrice,
			orderFees: this.state.orderFees
		};

		if (type === 'market') {
			delete order.price;
		} else if (price) {
			order.price = formatNumber(price);
		}

		if (showPopup) {
			openCheckOrder(order, () => {
				submit(FORM_NAME);
			});
		} else {
			submit(FORM_NAME);
		}
	};

	generateFormValues = (pair = '') => {
		const formValues = {
			type: {
				name: 'type',
				type: 'tab',
				options: STRINGS.TYPES,
				validate: [required]
			},
			side: {
				name: 'side',
				type: 'select',
				options: STRINGS.SIDES,
				validate: [required]
			},
			size: {
				name: 'size',
				label: (
					<div style={{ display: 'flex' }}>
						{STRINGS.formatString(
							STRINGS.STRING_WITH_PARENTHESIS,
							STRINGS.SIZE,
							<div className="pointer text-uppercase blue-link" onClick={this.setMax}>
								{STRINGS.CALCULATE_MAX}
							</div>
						)}
					</div>
				),
				type: 'number',
				placeholder: '0.00',
				normalize: normalizeFloat,
				step: LIMIT_VALUES[pair].SIZE.STEP,
				min: LIMIT_VALUES[pair].SIZE.MIN,
				max: LIMIT_VALUES[pair].SIZE.MAX,
				validate: [
					required,
					minValue(LIMIT_VALUES[pair].SIZE.MIN),
					maxValue(LIMIT_VALUES[pair].SIZE.MAX)
				],
				currency: STRINGS[`${pair.toUpperCase()}_SHORTNAME`]
			},
			price: {
				name: 'price',
				label: STRINGS.PRICE,
				type: 'number',
				placeholder: '0',
				normalize: normalizeInt,
				step: LIMIT_VALUES[pair].PRICE.STEP,
				min: LIMIT_VALUES[pair].PRICE.MIN,
				max: LIMIT_VALUES[pair].PRICE.MAX,
				validate: [
					required,
					minValue(LIMIT_VALUES[pair].PRICE.MIN),
					maxValue(LIMIT_VALUES[pair].PRICE.MAX),
					step(LIMIT_VALUES[pair].PRICE.STEP)
				],
				// normalize: normalizeInt,
				currency: STRINGS.FIAT_SHORTNAME
			}
		};

		this.setState({ formValues });
	};

	render() {
		const { balance, type, side, pair_base } = this.props;
		const {
			initialValues,
			formValues,
			orderPrice,
			orderFees,
			outsideFormError
		} = this.state;

		const currencyName = STRINGS[`${pair_base.toUpperCase()}_NAME`];

		if (!balance.hasOwnProperty(`${pair_base}_balance`)) {
			return <Loader relative={true} background={false} />;
		}

		return (
			<div
				className={classnames(
					'trade_order_entry-wrapper',
					'd-flex',
					'flex-column',
					`order_side-selector-${side}`
				)}
			>
				<Form
					currencyName={currencyName}
					evaluateOrder={this.evaluateOrder}
					onSubmit={this.onSubmit}
					onReview={this.onReview}
					formValues={formValues}
					initialValues={initialValues}
					outsideFormError={outsideFormError}
				>
					<Review
						type={type}
						currency={FIAT_NAME}
						orderPrice={orderPrice}
						fees={orderFees}
						formatToCurrency={formatFiatAmount}
					/>
				</Form>
			</div>
		);
	}
}

const selector = formValueSelector(FORM_NAME);

const mapStateToProps = (state) => {
	const formValues = selector(state, 'price', 'size', 'side', 'type');
	const { pair_base } = state.app.pairs[state.app.pair];
	return {
		...formValues,
		activeLanguage: state.app.language,
		fees: state.user.fees,
		pair: state.app.pair,
		pair_base
	};
};

const mapDispatchToProps = (dispatch) => ({
	submit: bindActionCreators(submit, dispatch),
	change: bindActionCreators(change, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderEntry);
