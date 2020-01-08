import * as React from 'react';
import { widget } from '../../charting_library/charting_library.min';
import { WHITE_THEME, DARK_THEME, VOLUME_WHITE, VOLUME_DARK, TOOLBAR_BG } from './ChartConfig';
import { getLanguage } from '../../utils/string';
import {
	getChartConfig,
	getChartSymbol,
	getChartHistory
} from '../../actions/chartAction';

function getThemeOverrides(theme = 'white') {
	if (theme === 'white') {
		return WHITE_THEME;
	} else {
		return DARK_THEME;
	}
};

function getStudiesOverrides(theme = 'white') {
	if (theme === 'white') {
		return VOLUME_WHITE;
	} else {
		return VOLUME_DARK;
	}
};

class TVChartContainer extends React.PureComponent {
	static defaultProps = {
		symbol: 'xht-usdt', // the trading tab we are in should be passed here
		interval: 'D',
		containerId: 'tv_chart_container',
		libraryPath: '/charting_library/',
		// chartsStorageUrl: 'https://saveload.tradingview.com',
		chartsStorageApiVersion: '1.1',
		clientId: 'tradingview.com',
		userId: 'public_user_id',
		fullscreen: false,
		autosize: true,
		studiesOverrides: {},
		time_frames: [
			{ text: '1D', resolution: '1' },
			{ text: '5D', resolution: '5' },
			{ text: '3M', resolution: '60' },
			{ text: '6M', resolution: '120' },
			{ text: '1m', resolution: '30' },
			// { text: "YTD", resolution: "YTD" },
			{ text: '1Y', resolution: 'D' },
			{ text: '3Y', resolution: 'D' },
			{ text: '5Y', resolution: 'W' }
			// { text: "ALL", resolution: "ALL" },
		]
	};

	constructor(props) {
		super(props);
		this.state = {
			subs: {},
			lastBar: {
				close: 0,
				high: 0,
				isBarClosed: false,
				isLastBar: true,
				low: 0,
				open: 0,
				time: new Date().getTime(),
				volume: 0,
			}
		};
	}

	componentWillMount() {
		var that = this;
		this.chartConfig = {
			onReady: (cb) => {
				getChartConfig().then((data) => {
					cb(data);
				});
			},
			searchSymbols: (
				userInput,
				exchange,
				symbolType,
				onResultReadyCallback
			) => { },
			resolveSymbol: (
				symbolName,
				onSymbolResolvedCallback,
				onResolveErrorCallback
			) => {
				// expects a symbolInfo object in response
				// var split_data = symbolName.split(/[-/]/)
				// var symbol_stub = {
				// 	name: symbolName,
				// 	description: '',
				// 	type: 'crypto',
				// 	session: '24x7',
				// 	timezone: 'Etc/UTC',
				// 	ticker: symbolName,
				// 	exchange: split_data[0],
				// 	minmov: 1,
				// 	pricescale: 100000000,
				// 	has_intraday: true,
				// 	intraday_multipliers: ['1', '60'],
				// 	supported_resolution:  supportedResolutions,
				// 	volume_precision: 8,
				// 	data_status: 'streaming',
				// }

				// if (split_data[2].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
				// 	symbol_stub.pricescale = 100
				// }
				const { increment_price } = this.props.pairData;
				getChartSymbol(symbolName, increment_price).then((data) => {
					onSymbolResolvedCallback(data);
				});

				// onResolveErrorCallback('Not feeling it today')
			},
			getBars: function (
				symbolInfo,
				resolution,
				from,
				to,
				onHistoryCallback,
				onErrorCallback,
				firstDataRequest
			) {
				getChartHistory(
					symbolInfo.ticker,
					resolution,
					from,
					to,
					firstDataRequest
				)
					.then(({ data }) => {
						if (data.length) {
							const bars = data.map((bar) => {
								return {
									time: new Date(bar.time).getTime(), //TradingView requires bar time in ms
									low: bar.low,
									high: bar.high,
									open: bar.open,
									close: bar.close,
									volume: bar.volume
								};
							});
							if (firstDataRequest) {
								that.setState({
									lastBar: bars[bars.length - 1]
								});
								// setBars[symbolInfo.ticker] = { lastBar: lastBar }
							}
							onHistoryCallback(bars, { noData: false });
						} else {
							onHistoryCallback(data, { noData: true });
						}
					})
					.catch((err) => {
						onErrorCallback(err);
					});
			},
			subscribeBars: (
				symbolInfo,
				resolution,
				onRealtimeCallback,
				subscribeUID,
				onResetCacheNeededCallback
			) => {
				that.setState({
					sub: {
						uid: subscribeUID,
						resolution,
						symbolInfo,
						lastBar: that.state.lastBar,
						listener: onRealtimeCallback
					}
				});
				// stream.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback);
			},
			unsubscribeBars: (subscriberUID) => {
				// stream.unsubscribeBars(subscriberUID)
			},
			calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
				//optional
				// while optional, this makes sure we request 24 hours of minute data at a time
				// CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
				return resolution < 60
					? { resolutionBack: 'D', intervalBack: '1' }
					: undefined;
			},
			getMarks: (
				symbolInfo,
				startDate,
				endDate,
				onDataCallback,
				resolution
			) => {
				//optional
			},
			getTimeScaleMarks: (
				symbolInfo,
				startDate,
				endDate,
				onDataCallback,
				resolution
			) => {
				//optional
			},
			getServerTime: (cb) => { }
		};
	}

	componentDidMount() {
		this.updateChart(this.props);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.activeTheme !== nextProps.activeTheme) {
			this.updateChart(nextProps);
		} else if (
			nextProps.tradeHistory &&
			nextProps.tradeHistory.length &&
			this.props.tradeHistory &&
			this.props.tradeHistory.length !== nextProps.tradeHistory.length &&
			this.state.sub
		) {
			this.updateBar(nextProps.tradeHistory[0]);
		}
	}

	componentWillUnmount() {
		if (this.tvWidget !== null && this.tvWidget._ready) {
			this.tvWidget.remove();
			this.tvWidget = null;
		}
	}

	updateChart = ({
		activeTheme,
		symbol,
		containerId,
		libraryPath,
		interval
	}) => {
		const widgetOptions = {
			symbol: symbol,
			// BEWARE: no trailing slash is expected in feed URL
			theme: activeTheme === 'white' ? 'light' : 'dark',
			toolbar_bg: TOOLBAR_BG[activeTheme],
			datafeed: this.chartConfig,
			interval: interval,
			container_id: containerId,
			library_path: libraryPath,

			locale: getLanguage(),
			withdateranges: true,
			range: 'ytd',
			disabled_features: [
				'use_localstorage_for_settings',
				'edit_buttons_in_legend',
				'context_menus',
				'border_around_the_chart',
				'header_symbol_search',
				'header_compare',
				'header_settings',
				'control_bar',
				'header_screenshot'
			],
			enabled_features: ['items_favoriting', 'support_multicharts'],
			time_frames: [
				{ text: '1m', resolution: '1m' },
				{ text: '1h', resolution: '1h' },
				{ text: '1D', resolution: '1D' },
				{ text: '1W', resolution: '1W' },
				{ text: '1M', resolution: '1M' }
				// // { text: "YTD", resolution: "YTD" },
				// { text: "1Y", resolution: "D" },
				// { text: "3Y", resolution: "D" },
				// { text: "5Y", resolution: "W" },
				// { text: "ALL", resolution: "ALL" },
			],
			charts_storage_url: this.props.chartsStorageUrl,
			charts_storage_api_version: this.props.chartsStorageApiVersion,
			client_id: this.props.clientId,
			user_id: this.props.userId,
			fullscreen: this.props.fullscreen,
			autosize: this.props.autosize,
			studies_overrides: getStudiesOverrides(activeTheme),
			favorites: {
				chartTypes: ['Area', 'Candles', 'Bars']
			},
			loading_screen: TOOLBAR_BG[activeTheme],
			custom_css_url: `${process.env.REACT_APP_PUBLIC_URL}/css/chart.css`,
			overrides: getThemeOverrides(activeTheme)
		};

		const tvWidget = new widget(widgetOptions);
		this.tvWidget = tvWidget;

		tvWidget.onChartReady(() => {
			const button = tvWidget
				.createButton({ align: 'right' })
				.attr(
					'title',
					'Take instant snapshot of your chart. No more paint or other editors to save screenshots - simply click the button and copy the link of the picture.'
				)
				.addClass('apply-common-tooltip screen-button')
				.on('click', () => tvWidget.takeScreenshot());
			tvWidget.applyOverrides(getThemeOverrides(activeTheme));
			if (activeTheme === 'white') {
				tvWidget.changeTheme('light');
			} else {
				tvWidget.changeTheme('dark');
			}

			button[0].innerHTML = `<div class='screen-container'><div class='screen-content'>Share Screenshot</div> <div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 17" width="21" height="17"><g fill="none" stroke="currentColor"><path d="M2.5 2.5h3.691a.5.5 0 0 0 .447-.276l.586-1.171A1 1 0 0 1 8.118.5h4.764a1 1 0 0 1 .894.553l.586 1.17a.5.5 0 0 0 .447.277H18.5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-16a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2z"></path><circle cx="10.5" cy="9.5" r="4"></circle></g></svg></div></div>`;
		});
	};

	updateBar(data) {
		const { sub } = this.state;
		let { lastBar, resolution } = sub;
		let coeff = 0;
		if (resolution.includes('60')) {
			// 1 hour in minutes === 60
			coeff = 60 * 60 * 1000;
		} else if (resolution.includes('D')) {
			// 1 day in minutes === 1440
			coeff = 60 * 60 * 24 * 1000;
		} else if (resolution.includes('W')) {
			// 1 week in minutes === 10080
			coeff = 60 * 60 * 24 * 7 * 1000;
		}

		const lastTradeTime = new Date(data.timestamp).getTime();
		let rounded = Math.floor(lastTradeTime / coeff) * coeff;
		var _lastBar;

		if (rounded > lastBar.time) {
			// create a new candle, use last close as open
			_lastBar = {
				time: rounded,
				open: lastBar.close ? lastBar.close : 0,
				high: lastBar.close ? lastBar.close : 0,
				low: lastBar.close ? lastBar.close : 0,
				close: data.price,
				volume: data.size
			};
		} else {
			// update lastBar candle!
			if (data.price < lastBar.low) {
				lastBar.low = data.price;
			} else if (data.price > lastBar.high) {
				lastBar.high = data.price;
			}

			lastBar.volume = lastBar.volume ? (lastBar.volume + data.size) : data.size;
			lastBar.close = data.price;
			if (!lastBar.low) lastBar.low = 0;
			if (!lastBar.close) lastBar.close = 0;
			if (!lastBar.high) lastBar.high = 0;
			if (!lastBar.open) lastBar.open = 0;
			if (!lastBar.time) lastBar.time = new Date().getTime();
			if (!lastBar.volume) lastBar.volume = 0;
			if (lastBar.isBarClosed === undefined) lastBar.isBarClosed = false;
			if (lastBar.isLastBar === undefined) lastBar.isLastBar = true;
			_lastBar = lastBar;
		}
		sub.listener(_lastBar);
		sub.lastBar = _lastBar;
		this.setState({
			sub: sub
		});
	}

	render() {
		return (
			<div
				id={this.props.containerId}
				style={{
					width: '100%',
					height: '100%',
					position: 'relative',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			/>
		);
	}
}

export default TVChartContainer;
