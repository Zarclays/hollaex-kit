import React from 'react';
import { connect } from 'react-redux';

import TVChartContainer from './Chart';
import { tradeHistorySelector } from './utils';

const ChartContainer = (props) => (
    <TVChartContainer {...props} />
);

const mapStateToProps = (state) => ({
    tradeHistory: tradeHistorySelector(state)
});

export default connect(mapStateToProps)(ChartContainer);
