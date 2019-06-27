import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import ReactSVG from 'react-svg';
import MarketList from './MarketList';
import STRINGS from '../../config/localizedStrings';
import { BASE_CURRENCY, ICONS } from '../../config/constants';
import { getClasesForLanguage } from '../../utils/string';
import { formatToCurrency } from '../../utils/currency';

class CurrencyList extends Component {
	state = {
		focusedSymbol: '',
		markets: {}
	};

	loadMarkets = (symbol = '', pair) => {
		this.removeFocus();

		if (symbol) {
			const markets = Object.entries(this.props.pairs).filter(
				([key, pair]) => pair.pair_base === symbol || pair.pair_2 === symbol
			);
			this.setState({ focusedSymbol: symbol, markets });
		}
	};

	removeFocus = () => {
		this.setState({
			focusedSymbol: '',
			markets: {}
		});
	};

	render() {
		const { className, pairs, orderBookData, activeTheme, pair, activeLanguage, coins } = this.props;
		const { markets, focusedSymbol } = this.state;
		const { min } = coins[BASE_CURRENCY] || {};
		const obj = {};
		Object.entries(pairs).forEach(([key, pair]) => {
			obj[pair.pair_base] = '';
		});
		const symbols = Object.keys(obj).map((key) => key);
		let marketPrice = {};
		Object.keys(orderBookData).forEach(order => {
			const symbol = order.split('-')[0];
			if(orderBookData[order].length && order.includes(STRINGS.FIAT_SHORTNAME_EN.toLowerCase())) marketPrice[symbol] = orderBookData[order][0].price;
		});
		return (
			<div
				className={classnames('currency-list f-0', className, getClasesForLanguage(activeLanguage))}
				onMouseLeave={this.removeFocus}
			>
				{symbols.map((symbol, index) => {
					let icon = ICONS[`${symbol.toUpperCase()}_ICON${activeTheme === 'dark' ? '_DARK' : ''}`];
					if (symbol === 'bch') {
						icon = ICONS[`${symbol.toUpperCase()}_NAV_ICON`];
					}
					return (
						<div
							key={index}
							className={classnames(
								'd-flex align-items-center single-currency',
								focusedSymbol === symbol && 'focused',
								pair.split('-')[0] === symbol && 'selected_currency-tab'
							)}
							onMouseEnter={() => this.loadMarkets(symbol)}
							onClick={() => this.loadMarkets(symbol)}
						>
							<ReactSVG path={icon} wrapperClassName="app_bar_currency-icon ml-2 mr-2" />
							{STRINGS[`${symbol.toUpperCase()}_NAME`]}:
							<div className="ml-1">
								{STRINGS.formatString(
									STRINGS.FIAT_PRICE_FORMAT,
									formatToCurrency(marketPrice[symbol], min),
									''
								)}
							</div>
							<div className="ml-1 mr-1">{`${STRINGS.FIAT_CURRENCY_SYMBOL}`}</div>
						</div>
					)
				})}
				{focusedSymbol && <MarketList markets={markets}  />}
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	pairs: store.app.pairs,
	coins: store.app.coins,
	orderBookData: store.orderbook.pairsTrades,
	activeTheme: store.app.theme,
	pair: store.app.pair,
	activeLanguage: store.app.language
});

export default connect(mapStateToProps)(CurrencyList);
