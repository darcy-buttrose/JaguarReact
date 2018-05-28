import React from 'react';
import AuthConnect from '../AuthConnect/index';
import DjangoButtons from '../DjangoButtons/index';
import AppHeaderLogo from '../../components/AppHeaderLogo/index';

class PublicHeader extends React.Component { // eslint-disable-line react/prefer-stateless-function
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

export default PublicHeader;
