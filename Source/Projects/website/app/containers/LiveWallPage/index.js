import Iframe from 'react-iframe';
import frameChannels from 'frame-channels';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectReducer from '../../utils/injectReducer';
import makeSelectLiveWall from './selectors';
import reducer from './reducer';
import { loginStart, loginSuccess, loginFailure } from './actions';

class LiveWallPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goChannel = this.goChannel.bind(this);
    this.channel = frameChannels.create('my-channel', { target: '#django-livewall-iframe' });
    props.onLogin();
    this.channel.subscribe((msg) => {
      console.log('Outer Got', msg);
      if (msg.token) {
        if (msg.token.length > 0) {
          props.onLoginSuccess(msg.token);
          // examine token for User or Admin here - then redirect based on value
          props.onUserRedirect();
        }
        if (msg.error && msg.error.length > 0) {
          props.onLoginFailure(`login failed: ${msg.error}`); // replace with intl message
        }
      }
    });
  }

  goChannel() {
    this.channel.push({ hello: 'world' });
  }

  // django url: http://10.1.1.73:8000/portal/ui/livewall/react/
  // local tewst: http://localhost:3000/livewall-inner
  render() {
    return (
      <Iframe
        url="http://10.1.1.73:8000/portal/ui/livewall/react/"
        id="django-livewall-iframe"
        display="flex"
        position="relative"
        allowFullScreen
      />
    );
  }
}

LiveWallPage.propTypes = {
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
  livewall: makeSelectLiveWall(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLogin: () => dispatch(loginStart()),
    onLoginSuccess: (token) => dispatch(loginSuccess(token)),
    onLoginFailure: (error) => dispatch(loginFailure(error)),
    onUserRedirect: () => dispatch(push('/private')),
    onAdminRedirect: () => dispatch(push('/')),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'livewall', reducer });

export default compose(
  withReducer,
  withConnect,
)(LiveWallPage);
