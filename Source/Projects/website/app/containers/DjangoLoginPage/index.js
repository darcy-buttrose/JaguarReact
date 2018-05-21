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

    this.channelHandler = this.channelHandler.bind(this);

    const { config } = props.app;
    this.channel = frameChannels.create(config.clientAppSettings.channel, { target: '#django-login-iframe' });
    props.onLogin();
    this.channel.subscribe(this.channelHandler);
  }


  componentWillUnmount() {
    if (this.channelHandler) {
      this.channel.unsubscribe(this.channelHandler);
    }
  }

  channelHandler(msg) {
    if (msg.isUserAuthenticated !== undefined && msg.isUserAuthenticated === false) {
      this.props.onLogout();
    }
    if (msg.isSessionTokenActive === false && msg.isUserAuthenticated === true) {
      this.setState({
        showIframe: false,
      });
    }
    if (msg.isSessionTokenActive === true) {
      if (msg.isSessionTokenActive && msg.token && msg.token.length > 0) {
        const user = {
          id_token: msg.token,
          profile: {
            name: '',
          },
        };
        this.props.onLoginSuccess(user);
        // examine token for User or Admin here - then redirect based on value
        this.props.onUserRedirect();
      }
      if (msg.error && msg.error.length > 0) {
        this.props.onLoginFailure(`login failed: ${msg.error}`); // replace with intl message
      }
    }
  }

  render() {
    const { config } = this.props.app;
    if (config) {
      const loginUrl = `http://${config.clientAppSettings.djangoUrl}portal/accounts/login/?next=/portal/ui/livewall/react/`;
      const iframeDisplay = this.state.showIframe ? 'flex' : 'none';

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
    onAdminRedirect: () => console.log('will redirect to home'),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(DjangoLoginPage);
