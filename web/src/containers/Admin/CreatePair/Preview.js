import React, { Fragment } from 'react';
import { Link } from 'react-router';
import { Button } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

import Coins from '../Coins';
import { renderStatus } from '../Trades/Pairs';

const Preview = ({
	isExchangeWizard,
	isPreview = false,
	isConfigure = false,
	formData = {},
	moveToStep,
	handleNext,
	onEdit,
	onDelete,
	isEdit,
	allCoins,
	user,
}) => {
	const pair_base_data =
		allCoins.filter((data) => data.symbol === formData.pair_base)[0] || {};
	const pair2_data =
		allCoins.filter((data) => data.symbol === formData.pair_2)[0] || {};
	return (
		<div>
			{!isPreview && !isConfigure ? (
				<Fragment>
					<div className="title">Review & confirm trading pair</div>
					<div className="grey-warning">
						<div className="warning-text">!</div>
						<div>
							<div className="sub-title">
								Please check the details carefully.
							</div>
							<div className="description">
								To avoid delays it is important to take the time to review the
								accuracy of the details below
							</div>
						</div>
					</div>
				</Fragment>
			) : null}
			<div
				className={
					!isPreview && !isConfigure
						? 'd-flex preview-container'
						: 'preview-container'
				}
			>
				<div
					className={
						!isPreview && !isConfigure
							? 'd-flex flex-container left-container'
							: 'd-flex flex-container left-container-preview'
					}
				>
					<div>
						<Coins
							nohover
							color={pair_base_data.meta ? pair_base_data.meta.color : ''}
							large
							small
							fullname={pair_base_data.fullname}
							type={(formData.pair_base || '').toLowerCase()}
						/>
						<div className="status-wrapper">
							{isPreview && !pair_base_data.verified ? (
								<div className="exclamation-icon">
									<ExclamationCircleFilled />
								</div>
							) : null}
							{isConfigure ? renderStatus(pair_base_data, user) : null}
						</div>
						{isPreview || isConfigure ? (
							<div>
								(
								<Link
									to={`/admin/financials?tab=1&preview=true&symbol=${formData.pair_base}`}
								>
									View details
								</Link>
								)
							</div>
						) : null}
					</div>
					<div className="cross-text">X</div>
					<div>
						<Coins
							nohover
							color={pair2_data.meta ? pair2_data.meta.color : ''}
							large
							small
							fullname={pair2_data.fullname}
							type={(formData.pair_2 || '').toLowerCase()}
						/>
						<div className="status-wrapper">
							{isPreview && !pair2_data.verified ? (
								<div className="exclamation-icon">
									<ExclamationCircleFilled />
								</div>
							) : null}
							{isConfigure ? renderStatus(pair2_data, user) : null}
						</div>
						{isConfigure || isPreview ? (
							<div>
								(
								<Link
									to={`/admin/financials?tab=1&preview=true&symbol=${formData.pair_2}`}
								>
									View details
								</Link>
								)
							</div>
						) : null}
					</div>
				</div>
				<div className={!isPreview && !isConfigure ? 'right-container' : ''}>
					<div className="right-content">
						{isConfigure ? <div className="title">Pair info</div> : null}
						<div>Base pair: {formData.pair_base}</div>
						<div>Price pair: {formData.pair_2}</div>
					</div>
					<div className="right-content">
						<div className="title">Parameters</div>
						{isConfigure ? <div>Name: {formData.name}</div> : null}
						<div>Status: {formData.active ? 'active' : 'Inactive'}</div>
						<div>Estimated price: {formData.estimated_price}</div>
						<div>Increment price: {formData.increment_price}</div>
						<div>Increment size: {formData.increment_size}</div>
						<div>Max price: {formData.max_price}</div>
						<div>Max size: {formData.max_size}</div>
						<div>Min price: {formData.min_price}</div>
						<div>Min size: {formData.min_size}</div>
						{isConfigure ? (
							<div>
								<Button type="primary" onClick={onEdit}>
									Edit
								</Button>
							</div>
						) : null}
					</div>
					{isPreview || isConfigure ? (
						<div className="right-content">
							<div className="title">Manage</div>
							<div className="d-flex">
								<div className="btn-wrapper">
									<Button type="danger" onClick={() => onDelete(formData)}>
										Remove
									</Button>
									<div className="separator"></div>
									<div className="description-small remove">
										Removing this pair will permanently delete this pair from
										your exchange. Use with caution!
									</div>
								</div>
							</div>
						</div>
					) : null}
				</div>
			</div>
			{!isPreview && !isConfigure ? (
				<div className="btn-wrapper">
					<Button
						className="green-btn"
						type="primary"
						onClick={() => {
							if (formData.id && !isExchangeWizard) {
								moveToStep('step1');
							} else {
								moveToStep('step2');
							}
						}}
					>
						Back
					</Button>
					<div className="separator"></div>
					<Button
						className="green-btn"
						type="primary"
						onClick={() => handleNext(formData)}
					>
						Next
					</Button>
				</div>
			) : null}
		</div>
	);
};

export default Preview;
