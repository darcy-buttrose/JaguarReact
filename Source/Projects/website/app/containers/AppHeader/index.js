import React from 'react';
import AppHeaderLogo from 'components/AppHeaderLogo';
import ProfileButtonContainer from 'containers/ProfileButtonContainer';

import DjangoButtons from '../DjangoButtons';
import LiveWallFullScreen from '../../components/LiveWallFullScreen';

function AppHeader() {
  return (
    <header className="app-header">
      <span className="app-header-logo">
        <AppHeaderLogo />
      </span>
      <span className="app-header-profile">
        <DjangoButtons />
        <LiveWallFullScreen />
        <ProfileButtonContainer />
      </span>
    </header>
  );
}

export default AppHeader;
