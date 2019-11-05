import React from 'react';
import classnames from 'classnames';
import { ICONS } from '../../config/constants';
import ReactSVG from 'react-svg';

const renderCheckboxImage = (checked) => (
	<ReactSVG
		path={checked ? ICONS.SUCCESS_BLACK : ICONS.SECURE}
		wrapperClassName="checkbutton-input-wrapper--image"
	/>
);

const onCheck = (disabled, onClick = () => {}, checked) => () => {
	if (!disabled) {
		onClick(!checked);
	}
};

const CheckboxButton = ({
	name = 'CheckboxButton',
	checked = false,
	onClick,
	label = 'Label',
	disabled = false,
	loading = false,
	children
}) => (
	<div className="checkbutton-wrapper">
		<div
			className={classnames(
				'checkbutton-input-wrapper',
				'd-flex',
				'align-items-center',
				{ pointer: !!onClick }
			)}
			onClick={onCheck(disabled, onClick, checked)}
		>
			{loading ? (
				<div className="checkbutton-input-wrapper--loader" />
			) : (
				renderCheckboxImage(checked, disabled)
			)}
			<span className="checkbutton-input-wrapper--label">{label}</span>
		</div>
		{children && <div className="checkbutton-content-wrapper">{children}</div>}
	</div>
);

export default CheckboxButton;
