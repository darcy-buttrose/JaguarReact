/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

export default function NotFound() {
  return (
    <div className="container">
      <div className="row">
        <div className="twelve columns">
          <h1>
            <FormattedMessage {...messages.header} />
          </h1>
        </div>
      </div>
    </div>
  );
}
