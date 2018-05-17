/**
 *
 * Auth Remove
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import SignOut from 'components/SignOut';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectReducer from 'utils/injectReducer';
import makeSelectAuth from '../Auth/selectors';
import reducer from '../Auth/reducer';
import { logout } from '../Auth/actions';
import mgr from '../AuthConnect/userManager';

export class AuthRemove extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  performAuthRemoval() {
    mgr.removeUser();
    this.props.onLogout();
    this.props.onRedirect();
  }

  render() {
    return (
      this.props.auth.isAuthenticated ? <SignOut onSignOut={() => { this.performAuthRemoval(); }} /> : <span></span>
    );
  }
}

AuthRemove.propTypes = {
  onLogout: PropTypes.func,
  onRedirect: PropTypes.func,
  auth: PropTypes.shape({
    user: PropTypes.shape({
      id_token: PropTypes.string,
      session_state: PropTypes.string,
      access_token: PropTypes.string,
      token_type: PropTypes.string,
      scope: PropTypes.string,
      expires_at: PropTypes.number,
      profile: PropTypes.shape({
        sid: PropTypes.string,
        sub: PropTypes.string,
        auth_time: PropTypes.number,
        idp: PropTypes.string,
        amr: PropTypes.array,
        preferred_username: PropTypes.string,
        name: PropTypes.string,
        email: PropTypes.string,
        email_verified: PropTypes.bool,
        given_name: PropTypes.string,
        role: PropTypes.array,
        scope: PropTypes.array,
      }),
    }),
    userName: PropTypes.string,
    isAuthenticated: PropTypes.bool,
    isAuthenticating: PropTypes.bool,
    showError: PropTypes.bool,
    errorMessage: PropTypes.string,
  }),
};

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLogout: () => dispatch(logout()),
    onRedirect: () => dispatch(push('/')),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'auth', reducer });

export default compose(
  withReducer,
  withConnect,
)(AuthRemove);
