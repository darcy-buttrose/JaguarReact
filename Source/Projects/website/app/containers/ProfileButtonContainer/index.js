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

import ThemeSwitcher from 'components/ThemeSwitcher';
import makeSelectAuth from '../../state/Auth/selectors';
import makeSelectApp from '../../state/App/selectors';
import makeSelectProfile from '../../state/Profile/selectors';
import { logout } from '../../state/Auth/actions';
import { changeTheme } from '../../state/Profile/actions';
import mgr from '../AuthConnect/userManager';

import appPropTypes from '../../state/App/propTypes';
import authPropTypes from '../../state/Auth/propTypes';
import profilePropTypes from '../../state/Profile/propTypes';

export class ProfileButtonContainer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  performAuthRemoval() {
    const { config } = this.props.app;
    if (config.clientAppSettings.authMode === 'identity') {
      mgr.removeUser();
    }
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
  app: PropTypes.shape(appPropTypes),
  onLogout: PropTypes.func,
  onRedirect: PropTypes.func,
  onChangeTheme: PropTypes.func,
  auth: PropTypes.shape(authPropTypes),
  profile: PropTypes.shape(profilePropTypes),
};

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
  profile: makeSelectProfile(),
  app: makeSelectApp(),
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

export default compose(
  withConnect,
)(ProfileButtonContainer);
