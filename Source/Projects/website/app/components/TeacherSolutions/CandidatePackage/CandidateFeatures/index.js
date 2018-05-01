import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

function CandidateFeatures() {
  return (
    <ul className="feature-listing">
      <li><FormattedMessage {...messages.listOne} /></li>
      <li><FormattedMessage {...messages.listTwo} /></li>
      <li><FormattedMessage {...messages.listThree} /></li>
    </ul>
  );
}

export default CandidateFeatures;
