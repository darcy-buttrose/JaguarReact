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

    const { config } = props.app;
    console.log('config', config);

    console.log('Logout Costructor');
    this.channel = frameChannels.create('my-channel', { target: '#django-logout-iframe' });
    console.log('Logout Costructor Channel: ', this.channel);
    props.onLogout();
    this.channel.subscribe((msg) => {
      console.log('Logout Got', msg);
      if (msg.isUserAuthenticated !== undefined) {
        if (!msg.isUserAuthenticated) {
          this.props.onUserRedirectToHome();
        } else {
          this.props.onUserRedirectToLogin();
        }
      }
    });
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
    onUserRedirectToHome: () => dispatch(push('/')),
    onUserRedirectToLogin: () => dispatch(push('/login')),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(DjangoLogoutPage);
