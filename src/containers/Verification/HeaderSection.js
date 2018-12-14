import React from 'react';
import ReactSVG from 'react-svg';

import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';
import { ActionNotification } from '../../components';

const HeaderSection = ({ title, children, openContactForm, icon }) => {
	return (
		<div className="header_title-wrapper d-flex flex-column w-100 f-1">
			<div className="d-flex">
				{!!icon && <div className="mr-2">
					<ReactSVG path={icon} wrapperClassName="header_title-icon" />
				</div>}
				<div>
					<div className="d-flex justify-content-between w-100 f-1">
						<div className="header_title-text font-weight-bold">{title}</div>
						<div className="header_title-action">
							<ActionNotification
								text={STRINGS.NEED_HELP_TEXT}
								status="information"
								iconPath={ICONS.BLUE_QUESTION}
								onClick={openContactForm}
								useSvg={true}
							/>
						</div>
					</div>
					{children && <div className="header_title-children">{children}</div>}
				</div>
			</div>
		</div>
	);
};

export default HeaderSection;

const ChildrenContainer = ({ mainContent, importantContent }) => (
	<div>
		{mainContent}
		{importantContent && (
			<div className="important_information">{importantContent}</div>
		)}
	</div>
);

export const IdentificationFormSection = () => (
	<ChildrenContainer
		mainContent={
			<div className="header_title-content">
				{
					STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.ID_SECTION
						.TITLE
				}
				<ul className="header_title-list">
					<li>
						{
							STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.ID_SECTION
								.LIST_ITEM_1
						}
					</li>
					<li>
						{
							STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.ID_SECTION
								.LIST_ITEM_2
						}
					</li>
					<li>
						{
							STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.ID_SECTION
								.LIST_ITEM_3
						}
					</li>
				</ul>
			</div>
		}
		importantContent={
			<div>
				<div className="id-warning">
					{
						STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.ID_SECTION
							.WARNING_3
					}
				</div>
				<div>
					{
						STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.ID_SECTION
							.WARNING_1
					}
				</div>
			</div>
		}
	/>
);

export const PORSection = () => (
	<ChildrenContainer
		mainContent={
			<div>
				<div className="header_title-content">
					{
						STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR
							.SECTION_1_TEXT_1
					}
					<br />
					{
						STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR
							.SECTION_1_TEXT_2
					}
					<br />
					{
						STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR
							.SECTION_1_TEXT_3
					}
					<br />
					{
						STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR
							.SECTION_1_TEXT_4
					}
				</div>
				<div className="header_title-content">
					{
						STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR
							.SECTION_2_TITLE
					}
					<ul className="header_title-list">
						<li>
							{
								STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR
									.SECTION_2_LIST_ITEM_1
							}
						</li>
						<li>
							{
								STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR
									.SECTION_2_LIST_ITEM_2
							}
						</li>
						<li>
							{
								STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR
									.SECTION_2_LIST_ITEM_3
							}
						</li>
					</ul>
				</div>
			</div>
		}
		importantContent={
			<div>
				{STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.WARNING}
			</div>
		}
	/>
);
