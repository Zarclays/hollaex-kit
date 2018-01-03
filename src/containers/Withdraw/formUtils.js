import math from 'mathjs';
import {
	required,
	minValue,
	maxValue,
	checkBalance,
	validAddress
} from '../../components/Form/validations';
import STRINGS from '../../config/localizedStrings';
import { CURRENCIES, WITHDRAW_LIMITS, ICONS } from '../../config/constants';
import { fiatSymbol } from '../../utils/currency';

export const generateInitialValues = (symbol, fees = {}) => {
	const { MIN } = WITHDRAW_LIMITS[symbol];
	const initialValues = {};

	if (symbol !== fiatSymbol) {
		initialValues.fee = fees.optimal || fees.min;
	}

	if (MIN) {
		initialValues.amount = MIN;
	}
	return initialValues;
};
export const generateFormValues = (
	symbol,
	available = 0,
	fees = {},
	calculateMax
) => {
	const { name } = CURRENCIES[symbol];
	const { MIN, MAX, STEP = 1 } = WITHDRAW_LIMITS[symbol];
	const fields = {};

	if (symbol !== fiatSymbol) {
		fields.address = {
			type: 'text',
			label: STRINGS.WITHDRAWALS_FORM_ADDRESS_LABEL,
			placeholder: STRINGS.WITHDRAWALS_FORM_ADDRESS_PLACEHOLDER,
			validate: [
				required,
				validAddress(symbol, STRINGS.WITHDRAWALS_INVALID_ADDRESS)
			]
		};
	}

	const amountValidate = [required];
	if (MIN) {
		amountValidate.push(minValue(MIN, STRINGS.WITHDRAWALS_MIN_VALUE_ERROR));
	}
	if (MAX) {
		amountValidate.push(maxValue(MAX, STRINGS.WITHDRAWALS_MAX_VALUE_ERROR));
	}
	// FIX add according fee
	// amountValidate.push(checkBalance(available, STRINGS.formatString(STRINGS.WITHDRAWALS_LOWER_BALANCE, name), fee));
	amountValidate.push(
		checkBalance(
			available,
			STRINGS.formatString(STRINGS.WITHDRAWALS_LOWER_BALANCE, name),
			0
		)
	);

	fields.amount = {
		type: 'number',
		label: STRINGS.formatString(STRINGS.WITHDRAWALS_FORM_AMOUNT_LABEL, name),
		placeholder: STRINGS.formatString(
			STRINGS.WITHDRAWALS_FORM_AMOUNT_PLACEHOLDER,
			name
		).join(''),
		min: MIN,
		max: MAX,
		step: STEP,
		validate: amountValidate,
		notification: {
			text: STRINGS.CALCULATE_MAX,
			status: 'information',
			iconPath: ICONS.BLUE_PLUS,
			className: 'file_upload_icon',
			onClick: calculateMax
		}
	};

	if (symbol !== fiatSymbol) {
		fields.fee = {
			type: 'editable',
			inputType: 'number',
			label: STRINGS.formatString(STRINGS.WITHDRAWALS_FORM_FEE_LABEL, name),
			placeholder: STRINGS.formatString(
				STRINGS.WITHDRAWALS_FORM_FEE_PLACEHOLDER,
				name
			).join(''),
			min: fees.min || MIN,
			max: fees.max || MAX,
			step: STEP,
			// information: fees.optimal ? STRINGS.formatString(STRINGS.WITHDRAWALS_FORM_FEE_OPTIMAL_VALUE, fees.optimal, name).join('') : '',
			validate: [required, minValue(fees.min), maxValue(fees.max)]
		};
	}

	return fields;
};
