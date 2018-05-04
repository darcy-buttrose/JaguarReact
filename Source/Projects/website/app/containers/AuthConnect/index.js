/**
 *
 * Auth
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import SignIn from 'components/SignIn';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectReducer from 'utils/injectReducer';
import makeSelectAuth from './selectors';
import reducer from './reducer';
import { loginStart, loginSuccess, loginFailure } from './actions';
import mgr from './userManager';

export class AuthConnect extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  performAuth() {
    this.props.onLogin();
    mgr.signinPopup();
    mgr.events.addUserLoaded((loadedUser) => {
      if (loadedUser) {
        this.props.onLoginSuccess(loadedUser);
        // examine token for User or Admin here - then redirect based on value
        this.props.onUserRedirect();
      } else {
        this.props.onLoginFailure('login failed'); // replace with intl message
      }
    });
  }

  render() {
    return (
      <SignIn onSignIn={() => { this.performAuth(); }} />
      // !this.props.auth.isAuthenticated ? <SignIn onSignIn={() => { this.performAuth(); }} /> : <div className="header-text">{this.props.auth.userName}</div>
    );
  }
}

AuthConnect.propTypes = {
  onLogin: PropTypes.func,
  onLoginSuccess: PropTypes.func,
  onLoginFailure: PropTypes.func,
  onUserRedirect: PropTypes.func,
  // onAdminRedirect: PropTypes.func,
  // auth: PropTypes.shape({
  //   user: PropTypes.shape({
  //     id_token: PropTypes.string,
  //     session_state: PropTypes.string,
  //     access_token: PropTypes.string,
  //     token_type: PropTypes.string,
  //     scope: PropTypes.string,
  //     expires_at: PropTypes.number,
  //     profile: PropTypes.shape({
  //       sid: PropTypes.string,
  //       sub: PropTypes.string,
  //       auth_time: PropTypes.number,
  //       idp: PropTypes.string,
  //       amr: PropTypes.array,
  //       preferred_username: PropTypes.string,
  //       name: PropTypes.string,
  //       email: PropTypes.string,
  //       email_verified: PropTypes.bool,
  //       given_name: PropTypes.string,
  //       role: PropTypes.array,
  //       scope: PropTypes.string,
  //     }),
  //   }),
  //   userName: PropTypes.string,
  //   isAuthenticated: PropTypes.bool,
  //   isAuthenticating: PropTypes.bool,
  //   showError: PropTypes.bool,
  //   errorMessage: PropTypes.string,
  // }),
};

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLogin: () => dispatch(loginStart()),
    onLoginSuccess: (user) => dispatch(loginSuccess(user)),
    onLoginFailure: (error) => dispatch(loginFailure(error)),
    onUserRedirect: () => dispatch(push('/private')),
    onAdminRedirect: () => dispatch(push('/')),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'auth', reducer });

export default compose(
  withReducer,
  withConnect,
)(AuthConnect);
