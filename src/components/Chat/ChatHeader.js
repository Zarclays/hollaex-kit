import React from 'react';
import classnames from 'classnames';

export const MinimalizeChat = ({ onClick }) => (
	<div className={classnames('d-flex', 'minimize-button')} onClick={onClick}>
		<div className="minimize-button-content" />
	</div>
);

export const ChatHeader = ({
	title,
	chatWrapperInitialized,
	minimized,
	minimizeChat
}) => (
	<div
		className={classnames(
			'd-flex',
			'justify-content-between',
			'align-items-center',
			'chat-header'
		)}
		onClick={minimized && minimizeChat}
	>
		<div className="d-flex chat-header_title">{title}</div>
		{!minimized && <MinimalizeChat onClick={minimizeChat} />}
	</div>
);
