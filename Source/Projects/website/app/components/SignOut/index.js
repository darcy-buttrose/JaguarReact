/**
*
* SignOut
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

function SignOut(props) {
  return (
    <span>
      <button className="signout-button" onClick={props.onSignOut}><FormattedMessage {...messages.signOut} /></button>
    </span>
  );
}

SignOut.propTypes = {
  onSignOut: PropTypes.func,
};

export default SignOut;
