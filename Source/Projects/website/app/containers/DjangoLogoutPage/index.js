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

    console.log('Parent Costructor');
    this.channel = frameChannels.create('my-channel', { target: '#django-login-iframe' });
    console.log('Parent Costructor Channel: ', this.channel);
    props.onLogout();
    this.channel.subscribe((msg) => {
      console.log('Outer Got', msg);
      if (!msg.isUserAuthenticated) {
        this.props.onUserRedirect();
      }
    });
  }

  render() {
    const { config } = this.props.app;
    console.log('render config', config);
    if (config) {
      const djangoLiveWallUrl = `http://${config.clientAppSettings.djangoUrl}portal/accounts/logout/`;
      console.log('djangoLoginUrl', djangoLiveWallUrl);

      return (
        <Iframe
          url={djangoLiveWallUrl}
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
  onUserRedirect: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  app: makeSelectApp(),
  auth: makeSelectAuth(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLogout: () => dispatch(logout()),
    onUserRedirect: () => dispatch(push('/')),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(DjangoLogoutPage);
