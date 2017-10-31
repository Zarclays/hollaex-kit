import React, { Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import '@material/button/dist/mdc.button.css';

const Button = ({ label, onClick, type, disabled, className }) => (
  <button
    type={type}
    onClick={onClick}
    className={classnames(
      'exir-button',
      'mdc-button',
      'mdc-button--unelevated',
      {
        disabled
      },
      className,
    )}
    disabled={disabled}
  >{label}</button>
);

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  type: 'submit',
  disabled: false,
  className: '',
}

export default Button;
