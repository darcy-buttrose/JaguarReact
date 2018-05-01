import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, Text, Checkbox } from 'react-form';
import _ from 'lodash';
import messages from './messages';


function TeacherQuoteForm(props) {
  const firstnameValidate = (firstName) => !firstName || firstName.trim() === '' ? 'first name is required' : null;
  const lastnameValidate = (lastName) => !lastName || lastName.trim() === '' ? 'last name is required' : null;
  const passwordValidate = (passWord) => !passWord || passWord.trim() === '' ? 'password is required' : null;
  const emailaddressValidate = (emailAddress) => {
    if (emailAddress) {
      const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; // eslint-disable-line no-useless-escape
      if (re.test(String(emailAddress).toLowerCase())) {
        return null;
      } else { // eslint-disable-line no-else-return
        return 'please enter a valid email address';
      }
    } else { // eslint-disable-line no-else-return
      return 'email is required';
    }
  };
  const confirmValidate = (passwordConfirm) => {
    if (!passwordConfirm || passwordConfirm.trim() === '') {
      return 'password confirmation is required';
    } else if (passwordConfirm !== props.package.password) {
      return 'entered passwords do not match';
    }
    return null;
  };
  const agreementValidate = (agreement) => {
    if (agreement) {
      return null;
    }
    return 'Please accept the terms and conditions';
  };

  const firstnameargs = {};
  if (props.package && props.package.firstName) firstnameargs.defaultValue = props.package.firstName;

  const lastnameargs = {};
  if (props.package && props.package.firstName) lastnameargs.defaultValue = props.package.lastName;

  const emailargs = {};
  if (props.package && props.package.emailAddress) emailargs.defaultValue = props.package.emailAddress;

  const termsargs = {};
  if (props.package && props.package.terms) termsargs.defaultValue = props.package.terms;

  const changeFirstNameValue = _.debounce((value) => {
    props.onUpdateFirstName(value);
  }, 1000);

  const changeLastNameValue = _.debounce((value) => {
    props.onUpdateLastName(value);
  }, 1000);

  const changeEmailValue = _.debounce((value) => {
    props.onUpdateEmail(value);
  }, 1000);

  const changePasswordValue = _.debounce((value) => {
    props.onUpdatePassword(value);
  }, 1000);

  const changeTermsValue = _.debounce((value) => {
    props.onUpdateTerms(value);
  }, 1000);

  return (
    <Form onSubmit={(submittedValues) => this.setState({ submittedValues })}>
      {(formApi) => (
        <form onSubmit={formApi.submitForm} id="personaldetails" className="connect-form">
          <label htmlFor="firstName">
            <FormattedMessage {...messages.firstName} />
          </label>
          <Text
            field="firstName"
            id="firstName"
            type="text"
            className={formApi.errors && formApi.errors.firstName ? 'has-error' : ''}
            validate={firstnameValidate}
            onChange={changeFirstNameValue}
            {...firstnameargs}
          />
          <label htmlFor="lastName">
            <FormattedMessage {...messages.lastName} />
          </label>
          <Text
            field="lastName"
            id="lastName"
            type="text"
            className={formApi.errors && formApi.errors.lastName ? 'has-error' : ''}
            validate={lastnameValidate}
            onChange={changeLastNameValue}
            {...lastnameargs}
          />
          <label htmlFor="emailAddress">
            <FormattedMessage {...messages.emailAddress} />
          </label>
          <Text
            field="emailAddress"
            id="emailAddress"
            type="text"
            className={formApi.errors && formApi.errors.emailAddress ? 'has-error' : ''}
            validate={emailaddressValidate}
            onChange={changeEmailValue}
            {...emailargs}
          />
          <label htmlFor="passWord">
            <FormattedMessage {...messages.passWord} />
          </label>
          <Text
            field="passWord"
            id="passWord"
            type="password"
            className={formApi.errors && formApi.errors.passWord ? 'has-error' : ''}
            validate={passwordValidate}
            onChange={changePasswordValue}
          />
          <label htmlFor="passwordConfirm">
            <FormattedMessage {...messages.passwordConfirm} />
          </label>
          <Text
            field="passwordConfirm"
            id="passwordConfirm"
            type="password"
            className={formApi.errors && formApi.errors.passwordConfirm ? 'has-error' : ''}
            validate={confirmValidate}
          />
          <div className="checkbox-container">
            <Checkbox
              field="agreement"
              id="agreement"
              className={formApi.errors && formApi.errors.agreement ? 'has-error' : ''}
              validate={agreementValidate}
              onChange={changeTermsValue}
            />
            <label htmlFor="agreement">
              <FormattedMessage {...messages.agreement} />
            </label>
          </div>
        </form>
     )}
    </Form>
  );
}

TeacherQuoteForm.propTypes = {
  package: PropTypes.shape({
    SubscriptionId: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    emailAddress: PropTypes.string,
    password: PropTypes.string,
    passwordConfirm: PropTypes.string,
    terms: PropTypes.bool,
    showError: PropTypes.bool,
    errorMessage: PropTypes.string,
  }),
};

export default TeacherQuoteForm;
