import React from 'react';
import { MIN_LEVEL_FOR_TOKENS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import { FieldError } from '../../components/Form/FormFields/FieldWrapper';
import ApiKeyContainer from './ApiKey';

const NoLevel = () => (
	<div className="mt-4 mb-4 apply_rtl">
		{STRINGS.DEVELOPER_SECTION.INVALID_LEVEL}
	</div>
);

export const NoOtpEnabled = ({ openOtp }) => (
	<div>
		<div className="mb-2">{STRINGS.DEVELOPER_SECTION.INFORMATION_TEXT}</div>
		<div className="mb-2">
			<FieldError
				error={STRINGS.DEVELOPER_SECTION.ERROR_INACTIVE_OTP}
				displayError={true}
				className="input_block-error-wrapper apply_rtl warning_text"
			/>
		</div>
		<div className="mb-4 mt-4 blue-link pointer" onClick={openOtp}>
			{STRINGS.DEVELOPER_SECTION.ENABLE_2FA}
		</div>
	</div>
);

export const OtpEnabled = ({ fetching, openDialog }) => (
	<div>
		<div className="mb-2">{STRINGS.DEVELOPER_SECTION.INFORMATION_TEXT}</div>
		<div className="mb-2">{STRINGS.DEVELOPER_SECTION.WARNING_TEXT}</div>
		{!fetching && (
			<div className="mb-4 mt-4 blue-link pointer" onClick={openDialog}>
				{STRINGS.DEVELOPER_SECTION.GENERATE_KEY}
			</div>
		)}
	</div>
);

export const PopupInfo = ({ type }) => {
	return (
		<div className="popup_info-wrapper mb-4">
			<div className="popup_info-title pb-1">{STRINGS.DEVELOPERS_TOKENS_POPUP[`${type.toUpperCase()}_TITLE`]}</div>
			<div className="popup_info-text mt-2">{STRINGS.DEVELOPERS_TOKENS_POPUP[`${type.toUpperCase()}_TEXT`]}</div>
		</div>
	)
}
export const DeveloperSection = ({ verification_level, ...rest }) => {
	let content;
	if (verification_level < MIN_LEVEL_FOR_TOKENS) {
		content = <NoLevel />;
	} else {
		content = <ApiKeyContainer {...rest} />;
	}
	return <div className="mt-4 mb-4 apply_rtl">{content}</div>;
};
