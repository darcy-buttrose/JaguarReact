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
import makeSelectAuth from '../Auth/selectors';
import makeSelectApp from '../App/selectors';
import makeSelectProfile from './selectors';
import reducer from './reducer';
import { logout } from '../Auth/actions';
import { changeTheme } from './actions';
import mgr from '../AuthConnect/userManager';
import '../../style/light/index.scss';
import appPropTypes from '../App/propTypes';
import authPropTypes from '../Auth/propTypes';
import profilePropTypes from './propTypes';

export class ProfileButtonContainer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  performAuthRemoval() {
    const { config } = this.props.app;
    if (config.clientAppSettings.authMode === 'identity') {
      mgr.removeUser();
      this.props.onLogout();
      this.props.onRedirect();
    } else {
      this.props.onLogoutRedirect();
    }
  }

  render() {
    return (
      <span>
        { this.props.profile.currentTheme === 'night' ? <ThemeSwitcher /> : '' }
        <button className="default-button" onClick={this.props.onGoLiveWall}>Livewall</button>
        {/* <button onClick={this.props.onGoLogin}>Login</button> */}
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
  onLogoutRedirect: PropTypes.func,
  onGoLiveWall: PropTypes.func,
//  onGoLogin: PropTypes.func,
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
    onLogoutRedirect: () => dispatch(push('/logout')),
    onChangeTheme: (item) => dispatch(changeTheme(item)),
    onGoLiveWall: () => dispatch(push('/livewall')),
    onGoLogin: () => dispatch(push('/login')),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'profile', reducer });

export default compose(
  withReducer,
  withConnect,
)(ProfileButtonContainer);
