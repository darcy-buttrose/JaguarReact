/**
 *
 * Auth
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import SignIn from '../../components/SignIn';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import makeSelectAuth from '../Auth/selectors';
import makeSelectApp from '../App/selectors';
import { loginStart, loginSuccess, loginFailure } from '../Auth/actions';
import mgr from './userManager';
import appPropTypes from '../App/propTypes';
import authPropTypes from '../Auth/propTypes';

export class AuthConnect extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  performAuth() {
    const { config } = this.props.app;
    if (config.clientAppSettings.authMode === 'identity') {
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
    } else {
      this.props.onLoginRedirect();
    }
  }

  render() {
    return (
      <SignIn onSignIn={() => { this.performAuth(); }} />
      // !this.props.auth.isAuthenticated ? <SignIn onSignIn={() => { this.performAuth(); }} /> : <div className="header-text">{this.props.auth.userName}</div>
    );
  }
}

AuthConnect.propTypes = {
  app: PropTypes.shape(appPropTypes),
  onLogin: PropTypes.func,
  onLoginSuccess: PropTypes.func,
  onLoginFailure: PropTypes.func,
  onUserRedirect: PropTypes.func,
  onLoginRedirect: PropTypes.func,
  // onAdminRedirect: PropTypes.func,
  auth: PropTypes.shape(authPropTypes),
};

const mapStateToProps = createStructuredSelector({
  app: makeSelectApp(),
  auth: makeSelectAuth(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLogin: () => dispatch(loginStart()),
    onLoginSuccess: (user) => dispatch(loginSuccess(user)),
    onLoginFailure: (error) => dispatch(loginFailure(error)),
    onUserRedirect: () => dispatch(push('/private')),
    onAdminRedirect: () => dispatch(push('/')),
    onLoginRedirect: () => dispatch(push('/login')),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(AuthConnect);
