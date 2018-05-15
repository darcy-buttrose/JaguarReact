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
import makeSelectApp from '../App/selectors';
import reducer from './reducer';
import { loginStart, loginSuccess, loginFailure } from './actions';
import appPropTypes from '../App/propTypes';

class LiveWallPage extends React.PureComponent {
  constructor(props) {
    super(props);

    const { config } = props.app;
    console.log('config', config);

    this.goChannel = this.goChannel.bind(this);
    console.log('Parent Costructor');
    this.channel = frameChannels.create('my-channel', { target: '#django-livewall-iframe' });
    console.log('Parent Costructor Channel: ', this.channel);
    props.onLogin();
    this.channel.subscribe((msg) => {
      console.log('Outer Got', msg);
      if (msg.token) {
        if (msg.token.length > 0) {
          props.onLoginSuccess(msg.token);
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
    const { config } = this.props.app;
    console.log('render config', config);
    if (config) {
      const djangoLiveWallUrl = `http://${config.clientAppSettings.djangoUrl}portal/ui/livewall/react/`;
      console.log('djangoLiveWallUrl', djangoLiveWallUrl);

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
