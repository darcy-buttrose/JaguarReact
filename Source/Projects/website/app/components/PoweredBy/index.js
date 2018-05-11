import React from 'react';
import { FormattedMessage } from 'react-intl';
import logo from 'assets/icetana-logo.svg';
import messages from './messages';

function PoweredBy() {
  return (
    <span className="app-powered-by">
      <FormattedMessage {...messages.powered} /> <img src={logo} alt="" />
    </span>
  );
}

export default PoweredBy;
