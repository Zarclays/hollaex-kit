import React from 'react';
import { Button } from '../';
import STRINGS from '../../config/localizedStrings';

const MessageDisplay = ({ text, onClick, buttonLabel = STRINGS.CLOSE_TEXT, iconPath }) => (
  <div className="success_display-wrapper d-flex align-content-between flex-wrap flex-column">
    <div className="success_display-content d-flex flex-column align-self-center flex-wrap justify-content-center align-items-center">
      <img src={iconPath} alt={text} className="success_display-content-image" />
      <div className="success_display-content-text">{text}</div>
    </div>
    <Button
      label={buttonLabel}
      onClick={onClick}
    />
  </div>
);

export default MessageDisplay;
