import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import STRINGS from '../../../config/localizedStrings';
import { getTradeVolume } from '../../../actions/userAction';
import { BarChart } from '../../../components';
import { calculatePrice } from '../../../utils/currency';
import { TRADING_VOLUME_CHART_LIMITS, SUMMMARY_ICON, CHART_MONTHS } from '../../../config/constants';

class TradingVolume extends Component {
    state = {
        chartData: [],
        limits: TRADING_VOLUME_CHART_LIMITS,
        limitContent: [],
        peakVolume: TRADING_VOLUME_CHART_LIMITS[TRADING_VOLUME_CHART_LIMITS.length - 1],
        totalVolume: 0
    };

    componentDidMount() {
        this.props.getTradeVolume();
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.tradeVolumes) !== JSON.stringify(nextProps.tradeVolumes)) {
            this.constructData(nextProps.tradeVolumes.data);
        }
    }

    constructData = tradeValues => {
        const { pairs, prices, activeTheme } = this.props;
        const chartData = [];
        let totalVolume = 0;
        let peakVolume = this.state.peakVolume;
        const currentMonth = moment().month();
        let chartMonths = [ ...CHART_MONTHS ];
        for (let i = 0; i <= currentMonth; i++) {
            let temp = chartMonths.shift();
            chartMonths = [ ...chartMonths, temp ];
        }
        
        if (Object.keys(tradeValues).length) {
            chartMonths.map((obj, key) => {
                let trade = tradeValues[obj.key];
                let data = {
                    key: obj.key,
                    month: obj.value
                }
                if (trade) {
                    let total = 0;
                    let pairWisePrice = {};
                    let pairVolume = {};
                    Object.keys(trade).map((pair) => {
                        let pairValue = pairs[pair] || {};
                        let volumeObj = trade[pair] || {};
                        let pairPrice = calculatePrice(volumeObj.volume, prices[pairValue.pair_base]);
                        pairWisePrice[pairValue.pair_base] = pairPrice;
                        pairVolume[pairValue.pair_base] = volumeObj.volume;
                        total += pairPrice;
                        return total;
                    });
                    data.pairVolume = pairVolume;
                    data.pairWisePrice = pairWisePrice;
                    data.total = total;
                } else {
                    data.pairVolume = {};
                    data.pairWisePrice = {};
                    data.total = 0;
                }
                if (peakVolume < data.total) {
                    peakVolume = data.total;
                }
                totalVolume += data.total;
                chartData.push(data);
                return chartData;
            });
            const limitContent = [];
            TRADING_VOLUME_CHART_LIMITS.map((_, index) => {
                if (index === 0) {
                    limitContent.push({
                        icon: SUMMMARY_ICON.KRAKEN,
                        text: STRINGS.SUMMARY.PRO_TRADER_ACCOUNT_ELIGIBLITY
                    });
                } else if (index === 1 && activeTheme === 'dark') {
                    limitContent.push({
                        icon: SUMMMARY_ICON.LEVIATHAN_DARK,
                        text: STRINGS.SUMMARY.VIP_TRADER_ACCOUNT_ELIGIBLITY
                    });
                } else {
                    limitContent.push({
                        icon: SUMMMARY_ICON.LEVIATHAN,
                        text: STRINGS.SUMMARY.VIP_TRADER_ACCOUNT_ELIGIBLITY
                    });
                }
                return index;
            });
            peakVolume += (peakVolume * 0.1);

            this.setState({ chartData, limitContent, peakVolume, totalVolume });
        }
    };

    render() {
        const { chartData, limits, limitContent, peakVolume } = this.state;
        const { tradeVolumes } = this.props;
        return (
            <div className="summary-section_2">
                <div className="w-100 h-100">
                    <div className="summary-content-txt">
                        <div>{STRINGS.formatString(
                            STRINGS.SUMMARY.TRADING_VOLUME_TXT_1,
                            STRINGS.FIAT_FULLNAME
                            )}
                        </div>
                        <div>{STRINGS.SUMMARY.TRADING_VOLUME_TXT_2}</div>
                    </div>
                    <BarChart
                        loading={tradeVolumes.fetching && !tradeVolumes.fetched}
                        chartData={chartData}
                        peakVolume={peakVolume}
                        yAxisLimits={limits}
                        limitContent={limitContent}
                        activeTheme={this.props.activeTheme} />
                </div>
            </div>
        );
    }
};

const mapStateToProps = state => ({
    tradeVolumes: state.user.tradeVolumes,
    pairs: state.app.pairs,
    prices: state.orderbook.prices,
    activeTheme: state.app.theme
});

const mapDispatchToProps = dispatch => ({
    getTradeVolume: bindActionCreators(getTradeVolume, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(TradingVolume);
