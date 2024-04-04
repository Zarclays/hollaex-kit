import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Modal from 'react-modal';
import { CloseOutlined } from '@ant-design/icons';
import { ActionNotification, Button } from 'hollaex-web-lib';

class Dialog extends PureComponent {
	static propTypes = {
		isOpen: PropTypes.bool.isRequired,
		label: PropTypes.string.isRequired,
		closeButton: PropTypes.func,
		onCloseDialog: PropTypes.func,
		children: PropTypes.node.isRequired,
	};

	onRequestClose = (e) => {
		if (this.props.onCloseDialog) {
			this.props.onCloseDialog(e);
		}
	};

	render() {
		const {
			isOpen,
			children,
			label,
			closeButton,
			shouldCloseOnOverlayClick,
			showCloseText,
			dialogId,
			className,
			bodyOpenClassName,
			strings: STRINGS,
		} = this.props;

		return (
			<Modal
				id={dialogId}
				isOpen={isOpen}
				contentLabel={label}
				onRequestClose={this.onRequestClose}
				shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
				portalClassName={classnames(
					className,
				)}
				bodyOpenClassName={bodyOpenClassName}
			>
				{showCloseText && !closeButton && (
					<ActionNotification
						text={
							<CloseOutlined
								style={{ fontSize: "24px" }}
								className="action_notification-image secondary-text"
							/>
						}
						onClick={this.onRequestClose}
						className="close-button"
					/>
				)}
				{children}
				{closeButton && (
					<div>
						<Button onClick={closeButton} label={STRINGS['CLOSE_TEXT']} />
					</div>
				)}
			</Modal>
		);
	}
}

Modal.setAppElement('#root');

Dialog.defaultProps = {
	shouldCloseOnOverlayClick: true,
	showCloseText: true,
	className: '',
	strings: {},
};

export default Dialog;
