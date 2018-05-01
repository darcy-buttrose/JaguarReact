import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

function ISSList() {
  return (
    <ul className="feature-listing">
      <li><FormattedMessage {...messages.listOne} /></li>
      <li><FormattedMessage {...messages.listTwo} /></li>
      <li><FormattedMessage {...messages.listThree} /></li>
      <li><FormattedMessage {...messages.listFour} /></li>
    </ul>
  );
}

export default ISSList;
