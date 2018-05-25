import React from 'react';
import AuthConnect from '../../containers/AuthConnect';
import DjangoButtons from '../../containers/DjangoButtons';
import AppHeaderLogo from '../AppHeaderLogo';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <header className="app-header">
        <span className="app-header-logo">
          <AppHeaderLogo />
        </span>
        <span className="app-header-profile">
          <DjangoButtons />
          <AuthConnect />
        </span>
      </header>
    );
  }
}

export default Header;
