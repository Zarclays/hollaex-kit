import React, { Component } from 'react';
import classnames from 'classnames';

import TableHeader from './TableHeader';
import TableBody from './TableBody';
// import TableFooter from './TableFooter';
import Paginator from './paginator';

class Table extends Component {
	state = {
		page: 0,
		// pageSize: 10,
		data: [],
		headers: []
	};

	componentDidMount() {
		// this.setPageSize(this.props.pageSize);
		if (this.props.jumpToPage) {
			this.goToPage(this.props.jumpToPage, this.props.data, this.props.headers, this.props.count);
		} else {
			this.goToPage(0, this.props.data, this.props.headers, this.props.count);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (
			nextProps.title === this.props.title &&
			nextProps.data.length !== this.props.data.length
		) {
			this.goToPage(
				this.state.page,
				nextProps.data,
				nextProps.headers,
				nextProps.count
			);
		} else {
			this.goToPage(0, nextProps.data, nextProps.headers, nextProps.count);
		}
	}

	// setPageSize = (pageSize = 10) => {
	//   this.setState({ pageSize });
	// }

	goToPreviousPage = () => {
		this.goToPage(
			this.state.page - 1,
			this.props.data,
			this.props.headers,
			this.props.count
		);
	};

	goToNextPage = () => {
		this.props.handleNext(this.props.pageSize, this.state.page + 1);
		this.goToPage(
			this.state.page + 1,
			this.props.data,
			this.props.headers,
			this.props.count
		);
	};

	goToPage = (page = 0, allData = [], headers = [], count = 0) => {
		const { showAll, pageSize } = this.props;
		const initItem = page * pageSize;
		if (showAll) {
			this.setState({ page: 1, data: allData, headers });
		} else if (initItem < count) {
			const data = allData.slice(initItem, initItem + pageSize);
			this.setState({ page, data, headers });
		}
	};

	render() {
		const count = this.props.count || this.props.data.length;

		if (count === 0) {
			return (
				<div className="no-data d-flex justify-content-center align-items-center">
					NO DATA
				</div>
			);
		}

		const { withIcon, displayPaginator, pageSize, cancelDelayData } = this.props;
		const { data, page, headers } = this.state;

		return (
			<div className="table_container">
				<table className={classnames('table-wrapper')}>
					<TableHeader headers={headers} />
					<TableBody cancelDelayData={cancelDelayData} headers={headers} data={data} withIcon={withIcon} />
				</table>
				{displayPaginator && (
					<Paginator
						currentPage={page + 1}
						pageSize={pageSize}
						count={count}
						goToPreviousPage={this.goToPreviousPage}
						goToNextPage={this.goToNextPage}
					/>
				)}
			</div>
		);
	}
}

Table.defaultProps = {
	data: [],
	headers: [],
	withIcon: false,
	pageSize: 10,
	displayPaginator: true,
	showAll: false,
	title: '',
	cancelDelayData: [],
	handleNext: () => {},
	jumpToPage: 0
};

export default Table;
