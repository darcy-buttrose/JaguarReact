import React from 'react';
import logo from 'assets/appheader-logo.svg';
import { Link } from 'react-router-dom';
import messages from './messages';

function AppHeaderLogo() {
  return (
    <span>
      <Link to="/">
        <img src={logo} alt={messages.logoAlt.defaultMessage} />
      </Link>
    </span>
  );
}

export default AppHeaderLogo;
