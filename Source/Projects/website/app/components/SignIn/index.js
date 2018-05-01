/**
*
* SignInOut
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

function SignIn(props) {
  return (
    <span>
      <button className="signin-button" onClick={props.onSignIn}><FormattedMessage {...messages.signIn} /></button>
    </span>
  );
}

SignIn.propTypes = {
  onSignIn: PropTypes.func,
};

export default SignIn;
