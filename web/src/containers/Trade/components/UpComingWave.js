import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactSvg from 'react-svg';

import { ICONS } from '../../../config/constants';
import { getWaveAuction } from '../../../actions/appActions';
import STRINGS from '../../../config/localizedStrings';

class UpComingWave extends Component {
    constructor(props) {
        super(props);
        this.state = {
            waveData: {},
            lastWave: {}
        }
    }
    
    componentDidMount() {
        this.props.getWaveAuction();
        this.constructData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevProps.wave) !== JSON.stringify(this.props.wave)) {
            this.constructData();
        }
    }

    constructData = () => {
        let defaultWave = {
            amount: "TBA",
            created_at: "TBA",
            filled: "TBA",
            floor: "TBA",
            id: "TBA",
            low: "TBA",
            no: "TBA",
            phase: "TBA",
            status: "TBA",
            updated_at: "TBA"
        };
        const { wave = [] } = this.props;
        let lastWave = wave.length > 1 ? wave[1] : defaultWave;
        this.setState({ waveData: wave.length ? wave[0] : defaultWave, lastWave });
    };
    
    render() {
        return (
            <div className="trade_orderbook-headers d-flex">
                <div>
                    <ReactSvg path={ICONS.INCOMING_WAVE} wrapperClassName="waves-icon" />
                </div>
                <div className="ml-3" >
                    <div className=" f-1 trade_orderbook-cell mb-2">
                        <span className="wave-header mr-2">
                            {STRINGS.WAVES.NEXT_WAVE}
                        </span>
                        <span className="wave-content">
                            {this.state.waveData.no}
                        </span>
                    </div>
                    <div className=" f-1 trade_orderbook-cell mb-2">
                        <span className="wave-header mr-2">
                            {STRINGS.WAVES.WAVE_AMOUNT}
                        </span>
                        <span className="wave-content">
                            {`${this.state.waveData.amount} ${this.props.pairBase}`}
                        </span>
                    </div>
                    <div className=" f-1 trade_orderbook-cell mb-2">
                        <span className="wave-header mr-2">
                            {STRINGS.WAVES.FLOOR}
                        </span>
                        <span className="wave-content">
                            {this.state.waveData.floor}
                        </span>
                    </div>
                    <div className=" f-1 trade_orderbook-cell mb-2">
                        <span className="wave-header mr-2">
                            {STRINGS.WAVES.LAST_WAVE}
                        </span>
                        <span className="wave-content">
                            {this.state.lastWave.amount}
                        </span>
                    </div>
                    <div className=" f-1 trade_orderbook-cell mb-3">
                        <a
                            href={"https://info.hollaex.com/hc/en-us/articles/360040098633-What-is-the-Wave-Auction-"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="blue-link pointer">
                            {STRINGS.HOME.SECTION_1_BUTTON_1}
                        </a>
                    </div>
                </div>
            </div>
        )
    }
};

const mapStateToProps = (state) => ({
    wave: state.app.wave
});

const mapDispatchToProps = (dispatch) => ({
    getWaveAuction: bindActionCreators(getWaveAuction, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UpComingWave);
