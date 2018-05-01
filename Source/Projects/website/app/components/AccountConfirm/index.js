import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import AccountConfirmForm from './AccountConfirmForm';
import messages from './messages';

function AccountConfirm(props) {
  return (
    <div>
      <p className="quote-confirmation-header">
        <FormattedMessage {...messages.header} />
      </p>
      <div className="quote-confirmation-box">
        <div>
          <p>
            <span className="hero confirm-label"><FormattedMessage {...messages.firstName} /></span>
            <span className="form-label confirm-value">{props.firstName}</span>
          </p>
        </div>
        <div>
          <p>
            <span className="hero confirm-label"><FormattedMessage {...messages.lastName} /></span>
            <span className="form-label confirm-value">{props.lastName}</span>
          </p>
        </div>
        <div>
          <p>
            <span className="hero confirm-label"><FormattedMessage {...messages.emailAddress} /></span>
            <span className="form-label confirm-value">{props.email}</span>
          </p>
        </div>
      </div>
      <div className="quote-confirmation-entry">
        <AccountConfirmForm />
      </div>
    </div>
  );
}

AccountConfirm.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
};

export default AccountConfirm;
