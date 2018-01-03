import React from 'react';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

import { IconTitle, Button } from '../../components';

const RequestResetPasswordSuccess = ({ onLoginClick, onContactUs }) => (
  <div className="auth_wrapper">
    <IconTitle
      iconPath={ICONS.PASSWORD_RESET}
      text={STRINGS.REQUEST_RESET_PASSWORD_SUCCESS.TITLE}
      textType="title"
      className="w-100"
    />
    <div className="text-center">
      {STRINGS.REQUEST_RESET_PASSWORD_SUCCESS.TEXT}
    </div>
    <div className="button-margin d-flex">
      <Button
        label={STRINGS.LOGIN_TEXT}
        onClick={onLoginClick}
      />
      <div className="separator"></div>
      <Button
        label={STRINGS.CONTACT_US_TEXT}
        onClick={onContactUs}
      />
    </div>
  </div>
);

export default RequestResetPasswordSuccess;
