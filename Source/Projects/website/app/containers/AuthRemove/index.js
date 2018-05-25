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
import authPropTypes from '../Auth/propTypes';

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
  auth: PropTypes.shape(authPropTypes),
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
