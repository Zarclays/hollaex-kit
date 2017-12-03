import React from 'react';
import { FieldArray, Field, reduxForm } from 'redux-form';

import renderFields from '../../components/Form/factoryFields';
import { Button } from '../../components';
import { required, password } from '../../components/Form/validations';

import STRINGS from '../../config/localizedStrings';

const validate = (values) => {
  const errors = {};
  if (values.new_password !== values.new_password_confirm) {
    errors.new_password_confirm = STRINGS.VALIDATIONS.PASSWORDS_DONT_MATCH;
  }

  return errors;
}

const Form = ({ handleSubmit, submitting, pristine, error, valid, initialValues }) => {
  const formFields = {
    old_password: {
      type: 'password',
      validate: [required, password],
      ...STRINGS.ACCOUNT_SECURITY.CHANGE_PASSWORD.FORM.CURRENT_PASSWORD,
    },
    new_password: {
      type: 'password',
      validate: [required, password],
      ...STRINGS.ACCOUNT_SECURITY.CHANGE_PASSWORD.FORM.NEW_PASSWORD,
    },
    new_password_confirm: {
      type: 'password',
      validate: [required],
      ...STRINGS.ACCOUNT_SECURITY.CHANGE_PASSWORD.FORM.NEW_PASSWORD_REPEAT,
    },
  };

  return (
    <form onSubmit={handleSubmit}>
      {renderFields(formFields)}
      {error && <div className="warning_text">{error}</div>}
      <Button
        label={STRINGS.ACCOUNT_SECURITY.CHANGE_PASSWORD.FORM.BUTTON}
        disabled={pristine || submitting || !valid}
      />
    </form>
  );
}

export default reduxForm({
  form: 'ChangePasswordForm',
  validate,
})(Form);
