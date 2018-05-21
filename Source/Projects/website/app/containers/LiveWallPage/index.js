import Iframe from 'react-iframe';
import frameChannels from 'frame-channels';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import makeSelectAuth from '../Auth/selectors';
import makeSelectApp from '../App/selectors';
import { loginStart, loginSuccess, loginFailure } from '../Auth/actions';
import appPropTypes from '../App/propTypes';
import userIsAuthenticated from '../../utils/userIsAuthenticated';

class LiveWallPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.channelHandler = this.channelHandler.bind(this);

    const { config } = props.app;
    this.channel = frameChannels.create(config.clientAppSettings.channel, { target: '#django-livewall-iframe' });
    props.onLogin();
    this.channel.subscribe(this.channelHandler);
  }

  componentWillUnmount() {
    if (this.channelHandler) {
      this.channel.unsubscribe(this.channelHandler);
    }
  }

  channelHandler(msg) {
    if (msg.token) {
      const user = {
        id_token: msg.token,
        profile: {
          name: '',
        },
      };
      this.props.onLoginSuccess(user);
    }
    if (msg.error && msg.error.length > 0) {
      this.props.onLoginFailure(`login failed: ${msg.error}`); // replace with intl message
    }
  }

  // django url: http://10.1.1.73:8000/portal/ui/livewall/react/
  // local tewst: http://localhost:3000/livewall-inner
  render() {
    const { config } = this.props.app;
    if (config) {
      const djangoLiveWallUrl = `http://${config.clientAppSettings.djangoUrl}portal/ui/livewall/react/`;

      return (
        <Iframe
          url={djangoLiveWallUrl}
          id="django-livewall-iframe"
          display="flex"
          position="relative"
          allowFullScreen
        />
      );
    }
    return null;
  }
}

LiveWallPage.propTypes = {
  app: PropTypes.shape(appPropTypes),
  onLogin: PropTypes.func,
  onLoginSuccess: PropTypes.func,
  onLoginFailure: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  app: makeSelectApp(),
  auth: makeSelectAuth(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLogin: () => dispatch(loginStart()),
    onLoginSuccess: (user) => dispatch(loginSuccess(user)),
    onLoginFailure: (error) => dispatch(loginFailure(error)),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(LiveWallPage);
