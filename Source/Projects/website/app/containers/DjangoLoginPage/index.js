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
import { loginStart, loginSuccess, loginFailure } from '../Auth/actions';
import appPropTypes from '../App/propTypes';

class DjangoLoginPage extends React.PureComponent {
  constructor(props) {
    super(props);

    const { config } = props.app;
    console.log('config', config);

    console.log('Parent Costructor');
    this.channel = frameChannels.create('my-channel', { target: '#django-login-iframe' });
    console.log('Parent Costructor Channel: ', this.channel);
    props.onLogin();
    this.channel.subscribe((msg) => {
      console.log('Outer Got', msg);
      if (msg.token) {
        if (msg.token.length > 0) {
          const user = {
            id_token: msg.token,
            profile: {
              name: '',
            },
          };
          props.onLoginSuccess(user);
          // examine token for User or Admin here - then redirect based on value
          this.props.onUserRedirect();
        }
        if (msg.error && msg.error.length > 0) {
          props.onLoginFailure(`login failed: ${msg.error}`); // replace with intl message
        }
      }
    });
  }

  render() {
    const { config } = this.props.app;
    console.log('render config', config);
    if (config) {
      const djangoLiveWallUrl = `http://${config.clientAppSettings.djangoUrl}portal/accounts/login/`;
      console.log('djangoLoginUrl', djangoLiveWallUrl);

      return (
        <Iframe
          url={djangoLiveWallUrl}
          id="django-login-iframe"
          display="flex"
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
  onLogin: PropTypes.func,
  onLoginSuccess: PropTypes.func,
  onLoginFailure: PropTypes.func,
  onUserRedirect: PropTypes.func,
  onAdminRedirect: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  app: makeSelectApp(),
  auth: makeSelectAuth(),
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

export default compose(
  withConnect,
)(DjangoLoginPage);
