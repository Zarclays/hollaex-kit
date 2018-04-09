import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import STRINGS from '../../config/localizedStrings';

import { FLEX_CENTER_CLASSES } from '../../config/constants';

const BUTTONS_CLASSES = ['buttons-section--button', ...FLEX_CENTER_CLASSES];

const Section1 = ({
	style = {},
	onClickScrollTo = () => {},
	onClickLearnMore,
	token
}) => (
	<div
		className={classnames(
			...FLEX_CENTER_CLASSES,
			'flex-column',
			'section_1-content'
		)}
		style={style}
	>
		<div className={classnames('f-1', ...FLEX_CENTER_CLASSES, 'flex-column')}>
			<div className="home-title text-capitalize">
				{STRINGS.HOME.SECTION_1_TITLE}
			</div>
			<div className="text-section text-center">
				<div>{STRINGS.HOME.SECTION_1_TEXT_1}</div>
				<div>{STRINGS.HOME.SECTION_1_TEXT_2}</div>
			</div>
			<div className={classnames('buttons-section', ...FLEX_CENTER_CLASSES)}>
				<div
					className={classnames(...BUTTONS_CLASSES, {
						pointer: onClickLearnMore
					})}
					onClick={onClickLearnMore}
				>
					{STRINGS.HOME.SECTION_1_BUTTON_1}
				</div>
				{!token && (
					<Link to="signup">
						<div className={classnames(...BUTTONS_CLASSES, 'contrast')}>
							{STRINGS.REGISTER_TEXT}
						</div>
					</Link>
				)}
			</div>
		</div>
		<div
			className={classnames('pointer', 'flex-0', 'scroll-button')}
			onClick={onClickScrollTo}
		/>
	</div>
);

export default Section1;
