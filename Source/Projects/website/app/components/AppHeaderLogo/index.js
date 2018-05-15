import React from 'react';
import logo from 'assets/appheader-logo.svg';
import messages from './messages';

function AppHeaderLogo() {
  return (
    <span>
      <img src={logo} alt={messages.logoAlt.defaultMessage} />
    </span>
  );
}

export default AppHeaderLogo;
