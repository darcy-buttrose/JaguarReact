import React from 'react';
import { FormattedMessage } from 'react-intl';
import PoweredBy from 'components/PoweredBy'
import messages from './messages';

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
