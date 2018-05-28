import React from 'react';
import AppHeaderLogo from '../../components/AppHeaderLogo/index';
import ProfileButtonContainer from '../ProfileButtonContainer/index';

class AppHeader extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <header className="app-header">
        <span className="app-header-logo">
          <AppHeaderLogo />
        </span>
        <span className="app-header-profile">
          <ProfileButtonContainer />
        </span>
      </header>
    );
  }
}

export default AppHeader;
