import Iframe from 'react-iframe';
import frameChannels from 'frame-channels';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import makeSelectAuth from '../Auth/selectors';
import makeSelectApp from '../App/selectors';
import { loginStart, loginSuccess, loginFailure, logout } from '../Auth/actions';
import appPropTypes from '../App/propTypes';

class DjangoLoginPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showIframe: true,
    };

    const { config } = props.app;
    console.log('config', config);

    console.log('Login Costructor');
    this.channel = frameChannels.create('my-channel', { target: '#django-login-iframe' });
    console.log('Login Costructor Channel: ', this.channel);
    props.onLogin();
    this.channelHandler = (msg) => {
      console.log('Login Got', msg);
      if (msg.isUserAuthenticated !== undefined && msg.isUserAuthenticated === false) {
        console.log('Login clear token');
        this.props.onLogout();
      }
      if (msg.isSessionTokenActive === undefined && msg.isUserAuthenticated !== undefined) {
        console.log('Login hiding ifrane ready for redirect');
        this.setState({
          showIframe: false,
        });
      }
      if (msg.isSessionTokenActive !== undefined) {
        if (msg.isSessionTokenActive && msg.token && msg.token.length > 0) {
          console.log('Login GOOD TO GO');
          const user = {
            id_token: msg.token,
            profile: {
              name: '',
            },
          };
          props.onLoginSuccess(user);
          // examine token for User or Admin here - then redirect based on value
          // console.log('Login wait 2000');
          // setTimeout(() => this.props.onUserRedirect(), 2000);
          this.props.onUserRedirect();
        }
        if (msg.error && msg.error.length > 0) {
          props.onLoginFailure(`login failed: ${msg.error}`); // replace with intl message
        }
      }
    };
    this.channel.subscribe(this.channelHandler);
  }

  componentWillUnmount() {
    if (this.channelHandler) {
      console.log('Login removing channel handler');
      this.channel.unsubscribe(this.channelHandler);
    }
  }
  render() {
    const { config } = this.props.app;
    console.log('render config', config);
    if (config) {
      const loginUrl = `http://${config.clientAppSettings.djangoUrl}portal/accounts/login/?next=/portal/ui/livewall/react/`;
      console.log('loginUrl', loginUrl);
      const iframeDisplay = this.state.showIframe ? 'flex' : 'none';
      console.log('iframeDisplay', iframeDisplay);

      return (
        <Iframe
          url={loginUrl}
          id="django-login-iframe"
          display={iframeDisplay}
          position="relative"
          allowFullScreen
        />
      );
    }
    return null;
  }
}


DjangoLoginPage.propTypes = {
  app: PropTypes.shape(appPropTypes),
  onLogout: PropTypes.func,
  onLogin: PropTypes.func,
  onLoginSuccess: PropTypes.func,
  onLoginFailure: PropTypes.func,
  onUserRedirect: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  app: makeSelectApp(),
  auth: makeSelectAuth(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLogout: () => dispatch(logout()),
    onLogin: () => dispatch(loginStart()),
    onLoginSuccess: (token) => dispatch(loginSuccess(token)),
    onLoginFailure: (error) => dispatch(loginFailure(error)),
    onUserRedirect: () => dispatch(push('/livewall')),
//    onUserRedirect: () => console.log('will redirect to livewall'),
    onAdminRedirect: () => console.log('will redirect to home'),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(DjangoLoginPage);
