import React, { Component } from 'react';
import { Modal, Button } from 'antd';

import Form from './PaymentForm';
import { AdminHocForm } from 'components';
import { required } from 'components/Form/validations';
import { validateBoolean } from 'components/AdminForm/validations';

const AddColumnForm = AdminHocForm('ADD_COLUMN_FORM');

class FormConfig extends Component {
	constructor(props) {
		super(props);
		this.state = {
			custom_fields: {},
			isAddColumn: false,
			currentSection: '',
			modalType: '',
			editData: {},
			headerName: '',
			label: '',
			required: '',
			editedValues: this.props.initialValues,
			buttonSubmitting: this.props.buttonSubmitting,
		};
	}

	componentDidMount() {
		if (this.props.initialValues) {
			this.generateInitialValues();
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			JSON.stringify(this.props.initialValues) !==
			JSON.stringify(prevProps.initialValues)
		) {
			this.generateInitialValues();
		}
		if (
			JSON.stringify(this.state.editedValues) !==
			JSON.stringify(prevState.editedValues)
		) {
			this.setState({ buttonSubmitting: true });
		}
	}

	generateInitialValues = () => {
		const { initialValues } = this.props;
		let initialValuesData = initialValues;
		if (
			Object.keys(initialValues).length === 1 &&
			this.props.currentActiveTab === 'onRamp'
		) {
			Object.keys(initialValues).forEach((item) => {
				initialValuesData = initialValues[item];
			});
		}
		let custom_fields = {};
		Object.keys(initialValuesData).forEach((item, index) => {
			custom_fields = {
				...custom_fields,
				...this.handleAddColumn(
					{ ...initialValuesData[item], section_type: item },
					'initialValue',
					index
				),
			};
		});
		this.setState({ custom_fields });
	};

	editColumn = (modalType = '', editData = {}) => {
		this.setState({
			isAddColumn: true,
			modalType,
			editData,
		});
	};

	addColumn = (currentSection = '') => {
		this.setState({ currentSection });
		this.editColumn('add');
	};

	handleRemoveHeader = (headerName, label, required) => {
		this.editColumn('delete_field');
		this.setState({
			headerName,
			label,
			required: required ? 'required' : 'optional',
		});
	};

	deleteProceed = () => {
		const { editedValues, headerName } = this.state;
		let data = {};
		Object.entries(this.state.custom_fields).forEach(([key, section]) => {
			let headerKeys =
				section.header && section.header.fields
					? Object.keys(section.header.fields)
					: [];
			if (!headerKeys.includes(headerName)) {
				data[key] = section;
			}
			this.setState({ custom_fields: data });
		});
		let temp = headerName.split('_');
		temp = `section_${temp[2]}`;
		let res = {};
		Object.keys(editedValues).forEach((item) => {
			if (item !== temp) {
				res = {
					...res,
					[item]: { ...editedValues[item] },
				};
			}
		});
		this.setState({ editedValues: res });
		this.onCancel();
	};

	onCancel = () => {
		this.setState({
			isAddColumn: false,
			editData: [],
			currentSection: '',
			buttonSubmitting: false,
		});
	};

	handleAddColumn = (formProps, type = '', index = 0) => {
		const { editData } = this.state;
		const { section_type } = formProps;
		let custom_fields = { ...this.state.custom_fields };
		let count = section_type
			? section_type.split('_')[1] || 2
			: this.state.currentSection.split('_')[1] || 2;
		if (section_type && type === 'initialValue') {
			custom_fields = {};
		}
		formProps.section_type = section_type || this.state.currentSection;

		const checkData = [];
		Object.keys(custom_fields).forEach((item, index) => {
			if (
				custom_fields[item]?.fieldLabel[
					`column_header_${index + 1}`
				]?.toLowerCase() === formProps?.label?.toLowerCase()
			) {
				checkData.push(item);
			}
		});

		if (checkData.length === 0) {
			custom_fields[section_type ? section_type : this.state.currentSection] = {
				className: 'section-wrapper',
				header: {
					className: 'section-header',
					fields: {
						[formProps?.key]: {
							type: 'input',
							label: (
								<div className="form-label">
									<div>
										<b>{formProps.label}:</b>
										{!formProps.required ? <div>(optional)</div> : null}
									</div>
									{this.props.currentActiveTab &&
									this.props.currentActiveTab !== 'offRamp' ? (
										<span
											className="anchor"
											onClick={() => this.editColumn('edit', formProps)}
										>
											Edit field name
										</span>
									) : null}
								</div>
							),
							placeholder:
								'(User input. Details will be shown in user verification page)',
							isClosable: true,
							closeCallback: () =>
								this.handleRemoveHeader(
									`column_header_${count}`,
									formProps.label,
									formProps.required
								),
							inputDefaultValue: formProps?.value,
							isTooltip: true,
							tooltipTitle:
								this.props.currentActiveTab === 'onRamp'
									? 'Field is for operator to fill'
									: 'This input is for your users in their verification page',
							name: formProps?.key,
							currentActiveTab: this.props.currentActiveTab,
						},
					},
				},
				isRequired: formProps.required,
				fieldLabel: { [`column_header_${count}`]: formProps.label },
				fieldKey: { [`column_header_${count}`]: formProps.key },
			};
		}
		if (section_type && type === 'initialValue') {
			return custom_fields;
		} else {
			this.setState({
				custom_fields,
			});
			if (checkData && checkData.length === 0) {
				this.onCancel();
			}
		}
		if (type === 'edit') {
			let editedValues = { ...this.state.editedValues };
			if (this.props.currentActiveTab === 'onRamp') {
				Object.keys(editedValues).forEach((item) => {
					let editedVal = editedValues[item];
					let filteredData = editedVal.filter(
						(val) => val.key !== formProps?.key
					);
					editedVal.forEach((val) => {
						if (formProps?.key === val?.key) {
							editedValues = {
								[item]: [
									...filteredData,
									{
										...formProps,
									},
								],
							};
						}
					});
				});
			} else {
				editedValues = {
					...editedValues,
					[editData?.section_type]: {
						...formProps,
					},
				};
			}
			this.setState({ editedValues });
		} else {
			let editedValues = { ...this.state.editedValues };
			if (this.props.currentActiveTab === 'onRamp') {
				if (Object.keys(editedValues).length) {
					Object.keys(editedValues).forEach((item) => {
						editedValues = {
							...editedValues,
							[item]: [
								...editedValues[item],
								{
									...formProps,
									key:
										formProps.label.split(' ').length > 1
											? formProps.label
													.toLowerCase()
													.trim()
													.replaceAll(' ', '_')
											: formProps.label.toLowerCase().trim(),
								},
							],
						};
					});
				} else {
					editedValues = {
						...editedValues,
						[`section_1`]: [
							{
								key:
									formProps.label.split(' ').length > 1
										? formProps.label.toLowerCase().trim().replaceAll(' ', '_')
										: formProps.label.toLowerCase().trim(),
								...formProps,
							},
						],
					};
				}
			} else {
				let sectionCount = Object.keys(editedValues).length + 1;
				editedValues = {
					...editedValues,
					[`section_${sectionCount}`]: {
						key:
							formProps.label.split(' ').length > 1
								? formProps.label.toLowerCase().trim().replaceAll(' ', '_')
								: formProps.label.toLowerCase().trim(),
						section_type: `section_${sectionCount}`,
						...formProps,
					},
				};
			}
			this.setState({ editedValues });
		}
	};

	handleSubmitLinks = (formProps) => {
		const { handleClose, currentActiveTab } = this.props;
		let finalEditData = this.state.editedValues;
		if (currentActiveTab && currentActiveTab === 'onRamp') {
			let formPropsData = {};
			Object.keys(formProps).forEach((item) => {
				const tempData = formProps[item];
				formPropsData = {
					...formPropsData,
					...tempData,
				};
			});
			let final = {};
			Object.keys(finalEditData).forEach((data) => {
				const itemData = finalEditData[data];
				const result = itemData.map((val) => {
					return {
						...val,
						value: formPropsData[val.key],
					};
				});
				final = {
					...final,
					[data]: result,
				};
			});
			finalEditData = final;
		}
		handleClose(true, 'savePayment', finalEditData);
	};

	validateExist = (value) => {
		const { editedValues, modalType, editData } = this.state;
		let isExistField = '';
		let valData =
			value &&
			value?.toLowerCase().trim().replace(/  +/g, ' ').replaceAll(' ', '_');
		if (value && editedValues && modalType === 'add') {
			Object.keys(editedValues).forEach((item) => {
				const temp = editedValues[item];
				if (temp && temp?.key?.toLowerCase() === valData) {
					isExistField = 'The given field is already exist';
				}
			});
		} else if (value && editedValues && modalType === 'edit') {
			Object.keys(editedValues).forEach((item) => {
				const temp = editedValues[item];
				if (
					temp &&
					temp?.key?.toLowerCase() === valData &&
					editData?.section_type !== temp?.section_type
				) {
					isExistField = 'The given field is already exist';
				}
			});
		}
		return isExistField;
	};

	renderModalContent = (type) => {
		const add_column_field = {
			label: {
				type: 'text',
				label: 'Payment detail name',
				placeholder: 'Input the payment detail name',
				validate: [required, this.validateExist],
			},
			required: {
				type: 'boolean',
				isPayment: true,
				defaultValue: 'required',
				validate: validateBoolean,
			},
		};

		switch (type) {
			case 'edit':
				return (
					<div className="add-field-modal">
						<h2>Edit payment detail</h2>
						<div className="mb-4">
							Payment details are for your users to fill out in their
							verification page.
						</div>
						<AddColumnForm
							initialValues={this.state.editData}
							fields={add_column_field}
							onSubmit={(val) => this.handleAddColumn(val, 'edit')}
							buttonText="Proceed"
							buttonClass="green-btn"
						/>
					</div>
				);
			case 'delete_field':
				return (
					<div className="payment-modal-wrapper">
						<h3>Delete field</h3>
						<div className="mt-3 mb-3 sider">
							<span>{this.state.label}: </span>
							{this.state.required === 'optional' ? (
								<div>(optional)</div>
							) : null}
						</div>
						<div className="mb-5">
							Are you sure you want to delete this field?
						</div>
						<div className="button-wrapper">
							<Button
								type="primary"
								className="green-btn w-100"
								onClick={() => this.deleteProceed(this.state.headerName)}
							>
								Proceed
							</Button>
						</div>
					</div>
				);
			default:
				return (
					<div className="add-field-modal">
						<h2>Add a payment detail</h2>
						<div className="mb-4">
							Input the payment details that you users will fill out in their
							verification page.
						</div>
						<AddColumnForm
							fields={add_column_field}
							onSubmit={this.handleAddColumn}
							buttonText="Proceed"
							buttonClass="green-btn"
						/>
					</div>
				);
		}
	};

	handleBack = () => {
		this.props.handleBack();
		this.setState({ editedValues: this.props.initialValues });
	};

	render() {
		const {
			custom_fields,
			isAddColumn,
			modalType,
			buttonSubmitting,
		} = this.state;
		let constructInitValue = {};
		if (
			this.props.currentActiveTab &&
			this.props.currentActiveTab === 'onRamp' &&
			this.props.initialValues &&
			Object.keys(this.props.initialValues).length
		) {
			Object.keys(this.props.initialValues).forEach((item) => {
				const tempData =
					this.props.initialValues && this.props.initialValues[item];
				if (tempData && tempData.length) {
					return tempData?.forEach((data) => {
						if (data?.required) {
							constructInitValue = {
								...constructInitValue,
								required: {
									...constructInitValue['required'],
									[data?.key]: data?.value,
								},
							};
						} else {
							constructInitValue = {
								...constructInitValue,
								optional: {
									...constructInitValue['optional'],
									[data?.key]: data?.value,
								},
							};
						}
					});
				}
			});
		}
		return (
			<div>
				<Form
					fields={custom_fields}
					initialValues={constructInitValue}
					customFields={true}
					addColumn={this.addColumn}
					handleSubmitLinks={this.handleSubmitLinks}
					buttonSubmitting={!buttonSubmitting}
					isFiat={this.props.isFiat}
					currentActiveTab={this.props.currentActiveTab}
					handleBack={this.handleBack}
				/>
				<Modal visible={isAddColumn} footer={null} onCancel={this.onCancel}>
					<div>{this.renderModalContent(modalType)}</div>
				</Modal>
			</div>
		);
	}
}

export default FormConfig;
