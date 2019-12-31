import React from 'react';
import { connect } from 'react-redux';
import ReactSvg from 'react-svg';
import moment from 'moment';

import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';

export const NotificationItem = (props) => {
	return (
		<div>
			<div>
				<div className="d-flex my-2">
					<div className="mr-2">
						<ReactSvg path={ICONS.TRADE_ANNOUNCEMENT} wrapperClassName="trade_post_icon" />
					</div>
					<div>
						<div className="post_header">{STRINGS.TRADE_POSTS.ANNOUNCEMENT}</div>
						<div className="post-content">
							<div>{moment('2019-12-30').format('MMMM DD, YYYY')}</div>
							<div>
								{STRINGS.TRADE_POSTS.ANNOUNCEMNT_TXT_4}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div>
				<div className="d-flex my-2">
					<div className="mr-2">
						<ReactSvg path={ICONS.TRADE_ANNOUNCEMENT} wrapperClassName="trade_post_icon" />
					</div>
					<div>
						<div className="post_header">{STRINGS.TRADE_POSTS.ANNOUNCEMENT}</div>
						<div className="post-content">
							<div>{moment('2019-12-16').format('MMMM DD, YYYY')}</div>
							<div>
								{STRINGS.TRADE_POSTS.ANNOUNCEMNT_TXT_3}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div>
				<div className="d-flex my-2">
					<div className="mr-2">
						<ReactSvg path={ICONS.TRADE_ANNOUNCEMENT} wrapperClassName="trade_post_icon" />
					</div>
					<div>
						<div className="post_header">{STRINGS.TRADE_POSTS.ANNOUNCEMENT}</div>
						<div className="post-content">
							<div>{moment('2019-11-13').format('MMMM DD, YYYY')}</div>
							<div>
								{STRINGS.formatString(
									STRINGS.TRADE_POSTS.ANNOUNCEMNT_TXT_1,
									<span>
										<a
											href={"https://docs.google.com/forms/u/2/d/1xf1mHxiTW6YUKVEqvfMJZqygiFxm1P6aUDS7uXe5Ouc/edit"}
											target="_blank"
											rel="noopener noreferrer"
											className="blue-link pointer">
												{STRINGS.TRADE_POSTS.APPLY_TODAY}
										</a>
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		// <div className="notifications_list-item-container">
		// 	<div>hii</div>
		// 	{type && <div className="notifications_list-item-title">{type}</div>}
		// 	<div className="notifications_list-item-text">{message}</div>
		// 	{timestamp && (
		// 		<div className="notifications_list-item-timestamp">
		// 			{formatTimestamp(timestamp)}
		// 		</div>
		// 	)}
		// </div>
	);
};

// TODO create announcement item style
const NotificationsList = ({ announcements }) => {
	return (
		< div className="notifications_list-wrapper" >
			{/* announcements.map(({ id , ...rest }, index) => ( */}
			< NotificationItem />
			{/* )) */}
		</div >
	);
}

const mapStateToProps = (store) => ({
	announcements: store.app.announcements
});

export default connect(mapStateToProps)(NotificationsList);
