import React from 'react';
import AppHeaderLogo from 'components/AppHeaderLogo';
import ProfileButtonContainer from 'containers/ProfileButtonContainer';

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
