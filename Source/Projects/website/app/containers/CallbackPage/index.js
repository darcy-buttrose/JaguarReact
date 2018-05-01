/**
 *
 * CallbackPage
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './messages';
import mgr from '../AuthConnect/userManager';

export class CallbackPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
    mgr.signinPopupCallback();
  }

  render() {
    return (
      <div>
        <FormattedMessage {...messages.info} />
      </div>
    );
  }
}

export default CallbackPage;
