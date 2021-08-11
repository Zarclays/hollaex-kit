import React, { Component } from 'react';
import { connect } from 'react-redux';
import { message } from 'antd';

import AddPairTab from './AddPairTab';
import PairParams from './PairParams';
import Preview from './Preview';
import { EditIncrement, EditTradable } from './EditParams';
import CreatePairSection from './CreatePairSection';
import PairSelection from './PairSelection';

import './index.css';

const defaultPairValues = {
    active: true,
    min_price: 0.001,
    max_price: 0.001,
    increment_price: 0.001,
    min_size: 0.001,
    max_size: 0.001,
    increment_size: 0.001,
    estimated_price: 1,
    is_public: true
};

class CreatePair extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 'step1',
            // addPairType: 'preset',
            formData: defaultPairValues,
            coinSecondary: this.props.coins,
            currentPresetPair: {},
            pairsRemaining: [],
            activeTab: "0"
        }
    }

    componentDidMount() {
        if (this.props.isEdit) {
            const formData = {
                ...this.state.formData,
                ...this.props.previewData
            };
            const coinSecondary = this.props.coins.filter(data => {
                if (typeof data === 'string') {
                    return data !== formData.pair_base;
                }
                return data.symbol !== formData.pair_base;
            });
            this.setState({
                // addPairType: 'addNew',
                formData,
                coinSecondary,
                currentStep: this.props.step
                    ? this.props.step
                    : 'step2'
            });
        } else {
            this.setPresetPair();
            this.selectBase(false);
            this.requestParams();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(this.props.pairs) !== JSON.stringify(prevProps.pairs)
            && !this.props.isEdit) {
            this.setPresetPair();
        }
    }

    requestParams = async () => {
        const { formData } = this.state;
        let estimated_price = formData.estimated_price || 1;
        if (estimated_price) {
            try {
                // const res = await getPairParams(estimated_price);
                const res = {};
                if (res.data) {
                    this.handleParamsUpdate(res.data);
                }
            } catch (error) {
                if (error.data && error.data.message) {
                    message.error(error.data.message);
                } else {
                    message.error(error.message);
                }
            }
        }
    };

    constructPresetData = (activeKey) => {
        const { allPairs, pairs, coins } = this.props;
        const coinKeys = coins.map(coin => {
            if (typeof coin === 'string') return coin;
            return coin.symbol;
        });
        const pairKeys = pairs.map(pair => pair.name);
        const totalRemaining = allPairs.filter(pair => {
            return !pairKeys.includes(pair.name) && pair.verified
                && coinKeys.includes(pair.pair_base)
                && coinKeys.includes(pair.pair_2)
        });
        let pairsRemaining = totalRemaining.filter(pair => pair.created_by === 1);
        if (activeKey === '1') {
            pairsRemaining = totalRemaining.filter(pair => pair.created_by !== 1);
        }
        return pairsRemaining;
    };

    setPresetPair = (activeKey) => {
        const pairsRemaining = this.constructPresetData(activeKey);
        let currentPresetPair = pairsRemaining[0] || {};
        this.setState({
            currentPresetPair,
            formData: {
                ...this.state.formData,
                ...currentPresetPair
            },
            pairsRemaining
        });
    };

    selectBase = (updateFormData = true) => {
        const { coins, isEdit } = this.props;
        if (coins.length) {
            let pair_base = typeof coins[0] === 'string' ? coins[0] : coins[0].symbol;
            const coinSecondary = this.props.coins.filter(data => {
                if (typeof data === 'string') {
                    return data !== pair_base;
                }
                return data.symbol !== pair_base;
            });
            let pair_2 = '';
            if (coinSecondary.length) {
                pair_2 = typeof coinSecondary[0] === 'string'
                    ? coinSecondary[0]
                    : coinSecondary[0].symbol;
            }
            if (updateFormData) {
                let formData = isEdit
                    ? { ...this.state.formData }
                    : { ...defaultPairValues };

                formData = {
                    ...formData,
                    pair_base,
                    pair_2,
                    name: `${pair_base}-${pair_2}`
                };
                if (!formData.estimated_price) {
                    formData.estimated_price = 1;
                }
                this.setState({ formData });
            }
            this.setState({ coinSecondary });
        }
    };

    handleNext = () => {
        if (this.state.currentStep === 'step1') {
            // if (this.state.addPairType === 'addNew') {
            //     const { formData } = this.state;
            //     this.setState({
            //         formData: {
            //             ...formData,
            //             name: `${formData.pair_base}-${formData.pair_2}`,
            //             code: `${formData.pair_base}-${formData.pair_2}`
            //         }
            //     });
            //     this.moveToStep('step2');
            // } else if (this.state.addPairType === 'preset') {
            this.moveToStep('preview');
            // }
            this.props.handleWidth();
        } else if (this.state.currentStep === 'step2') {
            if (this.props.isEdit && !this.props.isExchangeWizard) {
                this.props.onClose();
            } else {
                this.moveToStep('preview');
                this.props.handleWidth(650);
            }
        }
    };

    moveToStep = (step) => {
        this.setState({ currentStep: step });
    };

    handleConfirm = async (formData) => {
        // this.setState({ formData })
        this.props.handleConfirm(
            formData,
            this.props.isEdit,
            false,
            !!formData.id
        );
        this.props.onClose();
    };

    handleParamsUpdate = (params = {}) => {
        const formData = {
            ...this.state.formData,
            ...params
        }
        this.setState({ formData });
        this.props.editDataCallback(formData);
    };

    handleChange = (value, name) => {
        let coinSecondary = this.state.coinSecondary;
        let formData = {
            ...this.state.formData,
            [name]: value
        };
        if (name === 'pair_base') {
            coinSecondary = this.props.coins.filter(data => {
                if (typeof data === 'string') {
                    return data !== value;
                }
                return data.symbol !== value;
            });
            formData['pair_2'] = coinSecondary.length
                ? coinSecondary[0].symbol
                : formData.pair_2;
        }
        this.props.editDataCallback(formData);
        this.setState({
            formData,
            coinSecondary
        });
    };

    handleClose = () => {
        this.setState({ formData: {}, currentPresetPair: {} });
        this.props.onClose();
    };

    handleSelectType = (event) => {
        if (!this.props.isEdit) {
            this.selectBase();
            // this.requestParams();
        } else {
            this.setState({ formData: this.state.currentPresetPair });
        }
        // this.setState({
        //     addPairType: event.target.value,
        // });
    };

    handleSelectPair = (pair = {}) => {
        this.setState({
            currentPresetPair: pair,
            formData: {
                ...this.state.formData,
                ...pair
            },
            currentStep: 'step1'
        });
    };

    handleSearch = (e) => {
        const pairsRemaining = this.constructPresetData();
        const searchValue = e.target.value
            ? e.target.value.toLowerCase()
            : '';
        const filteredData = pairsRemaining.filter((pair) => {
            return (pair.name.includes(searchValue)
                || pair.pair_base.includes(searchValue)
                || pair.pair_2.includes(searchValue));
        });
        this.setState({ pairsRemaining: filteredData });
    };

    handleTabs = (activeTab) => {
        this.setPresetPair(activeTab);
        this.setState({ activeTab });
    };

    renderSection = () => {
        const {
            currentStep,
            formData,
            coinSecondary,
            currentPresetPair,
            pairsRemaining,
            activeTab
        } = this.state;
        const { coins, allCoins, allPairs, pairs, isExchangeWizard, isEdit } = this.props;
        switch (currentStep) {
            case 'preview':
                return <Preview
                    isExchangeWizard={isExchangeWizard}
                    coins={coins}
                    allCoins={allCoins}
                    formData={formData}
                    handleNext={this.handleConfirm}
                    moveToStep={this.moveToStep}
                    isEdit={isEdit}
                    activeTab={activeTab}
                    isCreatePair={true}
                />;
            case 'pair-selection':
                return <PairSelection
                    coins={allCoins}
                    pairsRemaining={pairsRemaining}
                    handleSelectPair={this.handleSelectPair}
                    handleSearch={this.handleSearch}
                    moveToStep={this.moveToStep}
                    activeTab={activeTab}
                    handleSelectType={this.handleSelectType}
                />
            case 'step2':
               return  <PairParams
                    coins={coins}
                    formData={formData}
                    isEdit={isEdit}
                    handleChange={this.handleChange}
                    handleNext={this.handleNext}
                    moveToStep={this.moveToStep}
                    requestParams={this.requestParams}
                    onClose={this.handleClose}
                />;
            case 'edit-tradable':
                return   <EditTradable
                    formData={formData}
                    handleChange={this.handleChange}
                    handleNext={this.handleNext}
                    moveToStep={this.moveToStep}
                />
            case 'edit-increment':
                return <EditIncrement
                    formData={formData}
                    handleChange={this.handleChange}
                    handleNext={this.handleNext}
                    moveToStep={this.moveToStep}
                />
            case 'pair-init-selection':
                return <CreatePairSection
                    isExchangeWizard={isExchangeWizard}
                    allPairs={allPairs}
                    coins={coins}
                    coinSecondary={coinSecondary}
                    pairs={pairs}
                    formData={formData}
                    activeTab={activeTab}
                    setPresetPair={this.setPresetPair}
                    handleChange={this.handleChange}
                    moveToStep={this.moveToStep}
                />;
            case 'step1':
            default:
                return <AddPairTab
                    isExchangeWizard={isExchangeWizard}
                    allCoins={allCoins}
                    pairs={pairs}
                    formData={formData}
                    currentPresetPair={currentPresetPair}
                    onClose={this.handleClose}
                    moveToStep={this.moveToStep}
                    moveToParentStep={this.props.moveToStep}
                    handleTabs={this.handleTabs}
                    activeTab={activeTab}
                    handleSelectType={this.handleSelectType}
                />;
        }
    };

    render() {
        return (
            <div className="pair-container">
                {this.renderSection()}
            </div>
        );
    }
};

const mapStateToProps = (state, ownProps) => {
    let exchange = {};
    if (state.exchange && state.exchange.length) {
        exchange = state.exchange[0]
    }
    return {
        exchange,
        coins: exchange.coins || [],
        pairs: exchange.pairs || [],
        allPairs: state.pair,
        allCoins: state.coin
    }
};

CreatePair.defaultProps = {
    handleWidth: () => { },
    editDataCallback: () => { }
};

export default connect(mapStateToProps)(CreatePair);
