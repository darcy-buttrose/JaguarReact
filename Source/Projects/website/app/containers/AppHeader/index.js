import React from 'react';
import AppHeaderLogo from '../../components/AppHeaderLogo';
import ProfileButtonContainer from '../ProfileButtonContainer';
import DjangoButtons from '../DjangoButtons';

function AppHeader() {
  return (
    <header className="app-header">
      <span className="app-header-logo">
        <AppHeaderLogo />
      </span>
      <span className="app-header-profile">
        <DjangoButtons />
        <ProfileButtonContainer />
      </span>
    </header>
  );
}

export default AppHeader;
