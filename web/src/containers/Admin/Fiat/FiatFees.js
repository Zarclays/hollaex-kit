import React, { useState, useEffect } from 'react';
import { message, Table, Button, Spin, Modal, Input } from 'antd';

import { CloseOutlined } from '@ant-design/icons';
import withConfig from 'components/ConfigProvider/withConfig';
import { connect } from 'react-redux';
import { updateConstants } from '../General/action';
import { requestAdminData } from 'actions/appActions';

const FiatFees = ({ coins }) => {
	const [coinData, setCoinData] = useState([]);
	const [coinCustomizations, setCoinCustomizations] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [queryValues] = useState();
	// eslint-disable-next-line
	const [editMode, setEditMode] = useState(false);
	const [selectedCoin, setSelectedCoin] = useState(true);
	const [queryFilters, setQueryFilters] = useState({
		total: 0,
		page: 1,
		pageSize: 10,
		limit: 50,
		currentTablePage: 1,
		isRemaining: true,
	});

	const [displayCostumizationModal, setDisplayCostumizationModal] = useState(
		false
	);

	const columns = [
		{
			title: 'Symbol',
			dataIndex: 'symbol',
			key: 'symbol',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.symbol}</div>;
			},
		},
		{
			title: 'Name',
			dataIndex: 'fullname',
			key: 'fullname',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.fullname || '-'}</div>;
			},
		},
		{
			title: 'Withdrawal Fee',
			dataIndex: 'withdrawal_fee',
			key: 'withdrawal_fee',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.withdrawal_fee || '-'}</div>;
			},
		},
		{
			title: 'Deposit Fee',
			dataIndex: 'deposit_fee',
			key: 'deposit_fee',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.deposit_fee || '-'}</div>;
			},
		},
		{
			title: 'Edit',
			dataIndex: 'edit',
			key: 'edit',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						<Button
							onClick={(e) => {
								e.stopPropagation();
								setEditMode(true);
								setSelectedCoin(data);
								setDisplayCostumizationModal(true);
							}}
							style={{ backgroundColor: '#CB7300', color: 'white' }}
						>
							Edit
						</Button>
					</div>
				);
			},
		},
	];

	useEffect(() => {
		// setIsLoading(true);
		requesCoinConfiguration(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		// requesCoinConfiguration(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryValues]);

	const requestDownload = () => {
		// return getExchangeSessionsCsv({ ...queryValues, format: 'csv' });
	};

	const requesCoinConfiguration = (page = 1, limit = 50) => {
		setIsLoading(true);
		// getCoinConfiguration({ page, limit, ...queryValues })
		requestAdminData()
			.then((response) => {
				const data = response?.data?.kit?.fiat_fees || {};

				for (const coin of Object.values(coins)) {
					if (coin.type === 'fiat') {
						data[coin.symbol] = {
							...(data[coin.symbol] || {
								symbol: coin.symbol,
								fee_markup: null,
							}),
							fullname: coin.fullname,
						};
					}
				}
				setCoinCustomizations(Object.values(data));
				setCoinData(data);

				setQueryFilters({
					total: response.count,
					fetched: true,
					page,
					currentTablePage: page === 1 ? 1 : queryFilters.currentTablePage,
					isRemaining: response.count > page * limit,
				});

				setIsLoading(false);
			})
			.catch((error) => {
				// const message = error.message;
				setIsLoading(false);
			});
	};

	const handleCostumizationModal = () => {
		setDisplayCostumizationModal(false);
		setSelectedCoin();
		setEditMode(false);
	};

	return (
		<div>
			<div style={{ color: '#ccc' }}>
				Below, You can add/edit fees for fiats available in your exchange, this
				will override the default fees set to fiats by default
			</div>
			<div>
				<div style={{ marginTop: 20 }}></div>
				<div className="mt-5">
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<span
							onClick={(e) => {
								requestDownload();
							}}
							className="mb-2 underline-text cursor-pointer"
							style={{ cursor: 'pointer' }}
						>
							{/* Download below CSV table */}
						</span>
						<div>
							<span>
								{/* <Button
									onClick={() => {
										setDisplayCostumizationModal(true)
									}}
									style={{
										backgroundColor: '#288500',
										color: 'white',
										flex: 1,
										height: 35,
										marginRight: 10,
									}}
									type="default"
								>
									Create New Customization
								</Button> */}
							</span>
							{/* <span>Total: {queryFilters.total || '-'}</span> */}
						</div>
					</div>

					<div className="mt-4" style={{ marginBottom: 80 }}>
						<Spin spinning={isLoading}>
							<Table
								className="blue-admin-table"
								columns={columns}
								dataSource={
									coinCustomizations || [].sort((a, b) => a.symbol - b.symbol)
								}
								rowKey={(data) => {
									return data.id;
								}}
								// pagination={{
								// 	current: queryFilters.currentTablePage,
								// 	onChange: pageChange,
								// }}

								pagination={false}
							/>
						</Spin>
					</div>
				</div>

				{displayCostumizationModal && (
					<Modal
						maskClosable={false}
						closeIcon={<CloseOutlined style={{ color: 'white' }} />}
						bodyStyle={{
							backgroundColor: '#27339D',
						}}
						visible={displayCostumizationModal}
						footer={null}
						onCancel={() => {
							handleCostumizationModal();
						}}
					>
						<div
							style={{
								fontWeight: '600',
								color: 'white',
								fontSize: 18,
								marginBottom: 10,
							}}
						>
							Edit Fiat Fees
						</div>
						<div style={{ marginBottom: 20 }}>
							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">Withdrawal Fee</div>
								<Input
									type="number"
									placeholder="Enter Withdrawal Fee"
									value={selectedCoin.withdrawal_fee}
									onChange={(e) => {
										setSelectedCoin({
											...selectedCoin,
											withdrawal_fee: e.target.value,
										});
									}}
								/>
							</div>

							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">Deposit Fee</div>
								<Input
									type="number"
									placeholder="Enter Deposit Fee"
									value={selectedCoin.deposit_fee}
									onChange={(e) => {
										setSelectedCoin({
											...selectedCoin,
											deposit_fee: e.target.value,
										});
									}}
								/>
							</div>
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								gap: 15,
								justifyContent: 'space-between',
								marginBottom: 20,
							}}
						>
							<Button
								onClick={() => {
									handleCostumizationModal();
								}}
								style={{
									backgroundColor: '#288500',
									color: 'white',
									flex: 1,
									height: 35,
								}}
								type="default"
							>
								Back
							</Button>
							<Button
								onClick={async () => {
									try {
										if (selectedCoin.withdrawal_fee) {
											selectedCoin.withdrawal_fee = Number(
												selectedCoin.withdrawal_fee
											);
										}

										if (selectedCoin.deposit_fee) {
											selectedCoin.deposit_fee = Number(
												selectedCoin.deposit_fee
											);
										}

										await updateConstants({
											kit: {
												fiat_fees: {
													...coinData,
													[selectedCoin.symbol]: {
														symbol: selectedCoin.symbol,
														withdrawal_fee: selectedCoin.withdrawal_fee,
														deposit_fee: selectedCoin.deposit_fee,
													},
												},
											},
										});

										requesCoinConfiguration();
										message.success('Changes saved.');
										handleCostumizationModal();
									} catch (error) {
										message.error(error.data.message);
									}
								}}
								style={{
									backgroundColor: '#288500',
									color: 'white',
									flex: 1,
									height: 35,
								}}
								type="default"
							>
								PROCEED
							</Button>
						</div>
					</Modal>
				)}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins,
});

export default connect(mapStateToProps)(withConfig(FiatFees));
