import React from 'react';
import PoweredBy from 'components/PoweredBy';
import DjangoButtons from '../../containers/DjangoButtons';


function StatusBar() {
  return (
    <footer className="app-status">
      <span className="app-powered">
        <PoweredBy />
      </span>
      <span className="app-item">
        <DjangoButtons position="footer" />
      </span>
    </footer>
  );
}

export default StatusBar;
