import React from "react";
import ReactSVG from "react-svg";
import classnames from "classnames";

import { DonutChart } from "../../../components";
import STRINGS from "../../../config/localizedStrings";
import {
	BASE_CURRENCY,
	ICONS,
	FLEX_CENTER_CLASSES,
	DEFAULT_COIN_DATA,
	SHOW_TOTAL_ASSETS,
	SHOW_SUMMARY_ACCOUNT_DETAILS,
} from "../../../config/constants";
import { formatAverage, formatToCurrency } from "../../../utils/currency";
import { isMobile } from "react-device-detect";

const AccountAssets = ({ chartData = [], totalAssets, balance, coins, activeTheme }) => {
	const baseValue = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
	// const Default_Icon = activeTheme === 'white' ? ICONS.DEFAULT_ICON : ICONS.DEFAULT_ICON_DARK;
	return (
		<div className="summary-section_2">
			<div className="summary-content-txt assets-description">
				<div>{STRINGS.SUMMARY.ACCOUNT_ASSETS_TXT_1}</div>
				{SHOW_SUMMARY_ACCOUNT_DETAILS
					? <div>{STRINGS.SUMMARY.ACCOUNT_ASSETS_TXT_2}</div>
					: null
				}
			</div>
			<div className="d-flex align-items-center justify-content-center h-100">
				<div className={
					classnames({
						'w-75': !SHOW_SUMMARY_ACCOUNT_DETAILS && !isMobile,
						'w-100': isMobile
					})}>
					<div
						className={
							classnames(
								"w-100 donut-container"
							)
						}>
						{BASE_CURRENCY && (
							<DonutChart
								coins={coins}
								chartData={chartData}
							/>
						)}
					</div>
					<div>
						<div
							className={
								classnames(
									"d-flex",
									{
										"justify-content-between": SHOW_SUMMARY_ACCOUNT_DETAILS,
										"justify-content-center": !SHOW_SUMMARY_ACCOUNT_DETAILS,
										"flex-wrap": isMobile
									}
								)}>
							{chartData.map((value, index) => {
								const { min, fullname, symbol = '' } =
									coins[value.symbol || BASE_CURRENCY] || {};
								let currencyBalance = formatToCurrency(
									balance[`${value.symbol}_balance`],
									min
								);
								return (
									<div key={index} className="price-content text-center">
										<div
											className={classnames(
												"coin-price-container",
												FLEX_CENTER_CLASSES
											)}
										>
											<ReactSVG
												path={
													ICONS[`${value.symbol.toUpperCase()}_ICON`]
														? ICONS[`${value.symbol.toUpperCase()}_ICON`]
														: ICONS.DEFAULT_ICON}
												wrapperClassName="coin-price"
											/>
										</div>
										<div className="price-text">{fullname}:</div>
										<div className="price-text">
											{`${symbol.toUpperCase()} ${formatAverage(currencyBalance)}`}
										</div>
										{value.symbol !== BASE_CURRENCY && (
											<div className="price-text">{`~${formatAverage(value.balanceFormat)}`}</div>
										)}
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
			{SHOW_TOTAL_ASSETS
				? <div className="text-center my-3 title-font">
					<span className="total-assets">
						{STRINGS.formatString(
							STRINGS.TOTAL_ASSETS_VALUE,
							baseValue.fullname,
							totalAssets
						)}
					</span>
				</div>
				: null
			}
		</div>
	);
};

export default AccountAssets;
