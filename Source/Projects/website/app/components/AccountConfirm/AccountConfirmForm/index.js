import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Form, Text } from 'react-form';
import messages from './messages';

function AccountConfirmForm() {
  const fieldFocus = (inputBox) => {
    if (inputBox.target.value.length === 1) {
      switch (inputBox.target.id) {
        case 'firstDigit':
          document.getElementById('secondDigit').focus();
          break;
        case 'secondDigit':
          document.getElementById('thirdDigit').focus();
          break;
        case 'thirdDigit':
          document.getElementById('fourthDigit').focus();
          break;
        case 'fourthDigit':
          document.getElementById('fifthDigit').focus();
          break;
        default:
          break;
      }
    }
  };

  const fieldValidate = (value) => !value || value.trim() === '' ? 'Required' : null;

  return (
    <div>
      <p className="centered"><FormattedMessage {...messages.header} /></p>
      <Form onSubmit={(submittedValues) => this.setState({ submittedValues })}>
        {(formApi) => (
          <form onSubmit={formApi.submitForm} id="signupconfirm" className="connect-form form-horizontal">
            <Text field="firstDigit" id="firstDigit" onKeyUp={fieldFocus} validate={fieldValidate} className={formApi.errors && formApi.errors.firstDigit ? 'has-error' : ''} />
            <Text field="secondDigit" id="secondDigit" onKeyUp={fieldFocus} validate={fieldValidate} className={formApi.errors && formApi.errors.secondDigit ? 'has-error' : ''} />
            <Text field="thirdDigit" id="thirdDigit" onKeyUp={fieldFocus} validate={fieldValidate} className={formApi.errors && formApi.errors.thirdDigit ? 'has-error' : ''} />
            <Text field="fourthDigit" id="fourthDigit" onKeyUp={fieldFocus} validate={fieldValidate} className={formApi.errors && formApi.errors.fourthDigit ? 'has-error' : ''} />
            <Text field="fifthDigit" id="fifthDigit" onKeyUp={fieldFocus} validate={fieldValidate} className={formApi.errors && formApi.errors.fifthDigit ? 'has-error' : ''} />
          </form>
      )}
      </Form>
    </div>
  );
}

export default AccountConfirmForm;
