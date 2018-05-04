import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

function Footer() {
  return (
    <footer>
      <section>
        &copy;<FormattedMessage {...messages.licenseMessage} />
      </section>
    </footer>
  );
}

export default Footer;
