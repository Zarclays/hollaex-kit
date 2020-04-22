import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { isMobile } from 'react-device-detect';
import { SubmissionError } from 'redux-form';
import { requestVerificationEmail } from '../../actions/authAction';
import EmailRequestForm, { generateFormFields } from './EmailRequestForm';
import EmailRequestSuccess from './EmailRequestSuccess';
import { IconTitle, Dialog, MobileBarBack } from '../../components';
import { ContactForm } from '../';
import { FLEX_CENTER_CLASSES, SUPPORT_HELP_URL } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

const BottomLink = () => (
	<div className={classnames('f-1', 'link_wrapper')}>
		{STRINGS.VERIFICATION_EMAIL_REQUEST.NO_EMAIL}
		<Link to="/verify" className={classnames('blue-link')}>
			{STRINGS.VERIFICATION_EMAIL_REQUEST.REQUEST_EMAIL}
		</Link>
	</div>
);

class VerifyEmailRequest extends Component {
	state = {
		success: false,
		showContactForm: false,
		formFields: generateFormFields()
	};

	onSubmitEmailRequest = (values) => {
		return requestVerificationEmail(values)
			.then((res) => {
				this.setState({ success: true });
			})
			.catch((error) => {
				if (error.response && error.response.status === 404) {
					this.setState({ success: true });
				} else {
					const errors = {};
					if (error.response) {
						errors._error = error.response.data.message;
					} else {
						errors._error = error.message;
					}
					throw new SubmissionError(errors);
				}
			});
	};

	onOpenDialog = () => {
		if (window) {
			window.open(SUPPORT_HELP_URL, '_blank');
		}
		// this.setState({ showContactForm: true });
	};

	onCloseDialog = () => {
		this.setState({ showContactForm: false });
	};

	onGoBack = () => {
		this.props.router.push(`/signup`);
	};

	onBackEmailRequest=() => {
		this.setState({ success: false });
	}
	
	render() {
		const { languageClasses, activeTheme, constants } = this.props;
		const { success, showContactForm, formFields } = this.state;

		if (success) {
			return (
				<div>
					{isMobile && !showContactForm && <MobileBarBack onBackClick={this.onBackEmailRequest}>
					</MobileBarBack>}
					<EmailRequestSuccess showContactForm={showContactForm} activeTheme = {activeTheme} onClick={this.onOpenDialog} />
					<Dialog
						isOpen={showContactForm}
						label="contact-modal"
						onCloseDialog={this.onCloseDialog}
						shouldCloseOnOverlayClick={false}
						style={{ 'z-index': 100 }}
						className={classnames(languageClasses)}
						showCloseText={false}
						theme={activeTheme}
					>
						<ContactForm
							onSubmitSuccess={this.onCloseDialog}
							onClose={this.onCloseDialog}
						/>
					</Dialog>
				</div>
			);
		}
		let path = constants.logo_path;
		if (activeTheme === 'dark') {
			path = constants.logo_black_path;
		}

		return (
			<div
				className={classnames(
					...FLEX_CENTER_CLASSES,
					'flex-column',
					'f-1',
					'login_container'
				)}
			>
			{isMobile && <MobileBarBack onBackClick={this.onGoBack} />}

				<div
					className={classnames(
						...FLEX_CENTER_CLASSES,
						'flex-column',
						'login_wrapper',
						'auth_wrapper',
						'w-100'
					)}
				>
					<IconTitle
						iconPath={path}
						text={STRINGS.VERIFICATION_EMAIL_REQUEST.TITLE}
						textType="title"
						underline={true}
						useSvg={false}
						isLogo={true}
						imageWrapperClassName="auth_logo-wrapper"
						className="w-100 exir-logo"
					/>
					<div
						className={classnames(
							...FLEX_CENTER_CLASSES,
							'flex-column',
							'login_form-wrapper',
							'auth_form-wrapper',
							'w-100'
						)}
					>
						<EmailRequestForm
							onSubmit={this.onSubmitEmailRequest}
							formFields={formFields}
						/>
						{isMobile && <BottomLink />}
					</div>
				</div>
				{!isMobile && <BottomLink />}
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	activeTheme: store.app.theme,
	constants: store.app.constants
});

export default connect(mapStateToProps)(VerifyEmailRequest);
