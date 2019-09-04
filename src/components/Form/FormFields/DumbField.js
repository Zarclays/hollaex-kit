import React from 'react';
import classnames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import FieldWrapper, { FieldContent } from './FieldWrapper';
import { ActionNotification } from '../../';
import { ICONS } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';

export const renderCopy = (text, onCopy, component) => {
	return (
		<CopyToClipboard text={text}>
			<ActionNotification
				status="information"
				text={STRINGS.COPY_TEXT}
				iconPath={ICONS.COPY_NEW}
				className="copy-wrapper"
				useSvg={true}
				onClick={onCopy}
			/>
		</CopyToClipboard>
	);
};

const DumbField = ({
	label,
	value,
	className = '',
	allowCopy = false,
	onCopy,
	copyOnClick = false,
	...rest
}) => {
	const props = {
		label,
		hideUnderline: true
	};

	return (
		<FieldWrapper
			className={classnames('dumb-field-wrapper', className)}
			{...rest}
		>
			<FieldContent {...props}>
				{copyOnClick
					? <CopyToClipboard text={value}>
						<div className="pointer" onClick={onCopy}>{value}</div>
					</CopyToClipboard>
					: value
				}
				{value && allowCopy && renderCopy(value, onCopy)}
			</FieldContent>
		</FieldWrapper>
	);
};

export default DumbField;
