import React from 'react';
import classnames from 'classnames';
import { ICONS } from '../../config/constants';

const renderCheckboxImage = (checked, disabled) => (
  <img
    src={checked ? ICONS.SUCCESS_BLACK : ICONS.SECURE}
    alt={checked ? 'checked' : 'unchecked'}
    className={classnames('checkbutton-input-wrapper--image')}
  />
)

const onCheck = (disabled, onClick = () => {}, checked) => () => {
  if (!disabled) {
    onClick(!checked);
  }
}

const CheckboxButton = ({
  name = 'CheckboxButton',
  checked = false,
  onClick,
  label = 'Label',
  disabled = false,
  loading = false,
  children
}) => (
  <div className={classnames('checkbutton-wrapper')}>
    <div
      className={classnames(
        'checkbutton-input-wrapper',
        'd-flex',
        'align-items-center',
        { pointer: !!onClick }
      )}
      onClick={onCheck(disabled, onClick, checked)}
    >
      {loading ?
        <div className={classnames('checkbutton-input-wrapper--loader')}>loading</div> :
        renderCheckboxImage(checked, disabled)
      }
      <span className={classnames('checkbutton-input-wrapper--label')}>{label}</span>
    </div>
    {children && <div className="checkbutton-content-wrapper">{children}</div>}
  </div>
);

export default CheckboxButton;
