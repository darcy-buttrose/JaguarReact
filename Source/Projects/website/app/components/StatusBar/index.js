import React from 'react';
import PoweredBy from 'components/PoweredBy';

function StatusBar() {
  return (
    <footer className="app-status">
      <span className="app-powered">
        <PoweredBy />
      </span>
    </footer>
  );
}

export default StatusBar;
