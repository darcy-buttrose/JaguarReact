import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

function MemberFeatures() {
  return (
    <ul className="feature-listing">
      <li><FormattedMessage {...messages.listOne} /></li>
    </ul>
  );
}

export default MemberFeatures;
