import React, { Component } from 'react';
import { Row, Col, Table, Spin } from 'antd';
import { CSVLink } from 'react-csv';
import { requestUserAudits } from './actions';

import { SubmissionError } from 'redux-form';

import { formatCurrency } from '../../../utils/index';
import Moment from 'react-moment';

const INITIAL_STATE = {
	tradeHistory: '',
	loading: true
};

const formatDate = (value) => {
	return <Moment format="YYYY/MM/DD HH:mm">{value}</Moment>;
};

const formatNum = (value) => {
	return <div>{formatCurrency(value)}</div>;
};

const formatDescription = (value) => {
	if (value.old) {
		return Object.keys(value.old).map((item, key) => {
			return (
				<div key={item}>
					{item}: {JSON.stringify(value.old[item])} ->{' '}
					{JSON.stringify(value.new[item])}
				</div>
			);
		});
	}
	return null;
};

const formatDescriptionNote = (value) => {
	return <div>{value.note}</div>;
};

const AUDIT_COLUMNS = [
	{ title: 'Event', dataIndex: 'event', key: 'event' },
	{
		title: 'Change',
		dataIndex: 'description',
		key: 'old',
		render: formatDescription
	},
	{
		title: 'Note',
		dataIndex: 'description',
		key: 'note',
		render: formatDescriptionNote
	},
	{ title: 'Admin', dataIndex: 'admin_id', key: 'admin_id' },
	{ title: 'IP', dataIndex: 'ip', key: 'ip' },
	{ title: 'Domain', dataIndex: 'domain', key: 'domain' },
	{
		title: 'Time',
		dataIndex: 'timestamp',
		key: 'timestamp',
		render: formatDate
	}
];
const CSV_AUDIT_COLUMNS = [
	{ label: 'Event', dataIndex: 'event', key: 'event' },
	{ label: 'IP', dataIndex: 'ip', key: 'ip' },
	{ label: 'Domain', dataIndex: 'domain', key: 'domain' },
	{ label: 'Time', dataIndex: 'timestamp', key: 'timestamp' }
];

class Audits extends Component {
	state = INITIAL_STATE;

	componentWillMount = () => {
		if (this.props.userId) {
			this.handleUserAudits(this.props.userId);
		}
	};

	handleUserAudits = (userId) => {
		requestUserAudits(userId)
			.then((res) => {
				if (res) {
					this.setState({
						audits: res.data,
						loading: false
					});
				}
			})
			.catch((err) => {
				if (err.status === 403) {
					this.setState({ loading: false });
				}
				throw new SubmissionError({ _error: err.data.message });
			});
	};

	render() {
		const { audits, loading } = this.state;

		if (loading) {
			return (
				<div className="app_container-content">
					<Spin size="large" />
				</div>
			);
		}

		return (
			<Row gutter={16} style={{ marginTop: 16 }}>
				<Col>
					<CSVLink
						filename={'audits-history.csv'}
						data={audits ? audits : 'No Data'}
						headers={CSV_AUDIT_COLUMNS}
					>
						Download table
					</CSVLink>
					<Table
						columns={AUDIT_COLUMNS}
						dataSource={audits ? audits : 'No Data'}
					/>
				</Col>
			</Row>
		);
	}
}

export default Audits;
