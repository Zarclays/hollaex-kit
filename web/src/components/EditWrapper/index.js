import React from 'react';
import { string, array, object, bool } from 'prop-types';
import classnames from 'classnames';

const EditWrapper = ({ children, stringId, iconId, position, style, reverse }) => {

  const [x = 5, y = 0] = position;
  const triggerStyles = {
    transform: `translate(${x}px, ${y}px)`
  };

  return (
    <div className={classnames("edit-wrapper__container", { reverse: reverse })} style={style}>
      {children}
      <div
        className="edit-wrapper__icons-container"
        style={triggerStyles}
      >
        {
          stringId && (
            <div
              className="edit-wrapper__icon-wrapper"
              data-string-id={stringId}
            >
              S
            </div>
          )
        }
        {
          iconId && (
            <div
              className="edit-wrapper__icon-wrapper"
              data-icon-id={iconId}
            >
              I
            </div>
          )
        }
      </div>
    </div>
  )
}

EditWrapper.propTypes = {
  stringId: string.isRequired,
  position: array,
  style: object,
  reverse: bool,
}

EditWrapper.defaultProps = {
  position: [],
  style: {},
  reverse: false,
}

export default EditWrapper;