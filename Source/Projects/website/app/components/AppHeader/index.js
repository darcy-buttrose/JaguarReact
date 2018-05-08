import React from 'react';
import { Link } from 'react-router-dom';
import AppHeaderLogo from 'components/AppHeaderLogo';
import ProfileButtonContainer from 'containers/ProfileButtonContainer';
import logo from 'assets/icetana-logo.svg';
import messages from './messages';

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
