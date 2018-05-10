/**
 *
 * Profile Button
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import ProfileButton from 'components/ProfileButton';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectReducer from 'utils/injectReducer';
import ThemeSwitcher from 'components/ThemeSwitcher';
import makeSelectAuth from '../AuthConnect/selectors';
import makeSelectProfile from './selectors';
import reducer from './reducer';
import { logout } from '../AuthConnect/actions';
import { changeTheme } from './actions';
import mgr from '../AuthConnect/userManager';
import '../../style/light/index.scss';

export class ProfileButtonContainer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  performAuthRemoval() {
    mgr.removeUser();
    this.props.onLogout();
    this.props.onRedirect();
  }

  render() {
    return (
      <span>
        { this.props.profile.currentTheme === 'night' ? <ThemeSwitcher /> : '' }
        <ProfileButton
          username={this.props.auth.userName}
          onLogout={() => { this.performAuthRemoval(); }}
          onChangeTheme={(item) => { this.props.onChangeTheme(item); }}
          currentTheme={this.props.profile.currentTheme}
          menuOpen={this.props.profile.menuOpen}
        />
      </span>
    );
  }
}

ProfileButtonContainer.propTypes = {
  onLogout: PropTypes.func,
  onRedirect: PropTypes.func,
  onChangeTheme: PropTypes.func,
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
        scope: PropTypes.string,
      }),
    }),
    userName: PropTypes.string,
    isAuthenticated: PropTypes.bool,
    isAuthenticating: PropTypes.bool,
    showError: PropTypes.bool,
    errorMessage: PropTypes.string,
  }),
  profile: PropTypes.shape({
    menuOpen: PropTypes.bool,
    currentTheme: PropTypes.string,
  }),
};

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLogout: () => dispatch(logout()),
    onRedirect: () => dispatch(push('/')),
    onChangeTheme: (item) => dispatch(changeTheme(item)),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'profile', reducer });

export default compose(
  withReducer,
  withConnect,
)(ProfileButtonContainer);
