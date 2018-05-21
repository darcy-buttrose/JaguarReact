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
import { logout } from '../Auth/actions';
import appPropTypes from '../App/propTypes';

class DjangoLogoutPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.channelHandler = this.channelHandler.bind(this);

    const { config } = props.app;
    console.log('config', config);

    console.log('Logout: Costructor');
    console.log(`Logout: channel is ${JSON.stringify(config.clientAppSettings.channel)}`);
    this.channel = frameChannels.create(config.clientAppSettings.channel, { target: '#django-logout-iframe' });
    console.log('Logout: Costructor Channel: ', this.channel);
    this.channel.subscribe(this.channelHandler);
  }

  componentWillUnmount() {
    if (this.channelHandler) {
      console.log('Logout: removing channel handler');
      this.channel.unsubscribe(this.channelHandler);
    }
  }

  channelHandler(msg) {
    console.log('Logout: Got', msg);
    if (msg.isUserAuthenticated !== undefined) {
      if (!msg.isUserAuthenticated) {
        this.props.onLogout();
      }
      this.props.onUserRedirectToLogin();
    }
  }

  render() {
    const { config } = this.props.app;
    console.log('render config', config);
    if (config) {
      const logoutUrl = `http://${config.clientAppSettings.djangoUrl}portal/accounts/logout/`;
      console.log('logoutUrl', logoutUrl);

      return (
        <Iframe
          url={logoutUrl}
          id="django-logout-iframe"
          display="flex"
          position="relative"
          allowFullScreen
        />
      );
    }
    return null;
  }
}


DjangoLogoutPage.propTypes = {
  app: PropTypes.shape(appPropTypes),
  onLogout: PropTypes.func,
  onUserRedirectToHome: PropTypes.func,
  onUserRedirectToLogin: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  app: makeSelectApp(),
  auth: makeSelectAuth(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLogout: () => dispatch(logout()),
    onUserRedirectToHome: () => console.log('will redirect to home'),
    onUserRedirectToLogin: () => dispatch(push('/login')),
//    onUserRedirectToLogin: () => console.log('will redirect to login'),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(DjangoLogoutPage);
