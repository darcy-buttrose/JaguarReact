import Iframe from 'react-iframe';
import frameChannels from 'frame-channels';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import makeSelectAuth from '../../state/Auth/selectors';
import makeSelectApp from '../../state/App/selectors';
import makeSelectLiveWall from './selectors';
import { updateToken, startUpdateProfile } from '../../state/Auth/actions';
import appPropTypes from '../../state/App/propTypes';
import userIsAuthenticated from '../../utils/userIsAuthenticated';
import authPropTypes from '../../state/Auth/propTypes';

import liveWallPropTypes from './propTypes';
// import reducer from './reducer';
import injectReducer from '../../utils/injectReducer';


class LiveWallPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.channelHandler = this.channelHandler.bind(this);

    const { config } = props.app;
    this.channel = frameChannels.create(config.clientAppSettings.channel, { target: '#django-livewall-iframe' });
    this.channel.subscribe(this.channelHandler);
  }

  componentWillUnmount() {
    if (this.channelHandler) {
      this.channel.unsubscribe(this.channelHandler);
    }
  }

  channelHandler(msg) {
    console.log('LiveWallPage: channelHandler msg', msg);

    if (msg.token) {
      this.props.onUpdateToken(msg.token);
    }
  }

  // django url: http://10.1.1.73:8000/portal/ui/livewall/react/
  // local tewst: http://localhost:3000/livewall-inner
  render() {
    const { config } = this.props.app;
    const filter = this.props.liveWall.filter === 0 ? '' : this.props.liveWall.filter + '/' ;

    if (config) {
      const djangoLiveWallUrl = `http://${config.clientAppSettings.djangoUrl}portal/ui/livewall/react/${filter}`;

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
  liveWall: PropTypes.shape(liveWallPropTypes), 
  auth: PropTypes.shape(authPropTypes),
  onUpdateToken: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  app: makeSelectApp(),
  liveWall: makeSelectLiveWall(),
  auth: makeSelectAuth(),
});

function mapDispatchToProps(dispatch) {
  return {
    onUpdateToken: (token) => {
      dispatch(updateToken(token));
      dispatch(startUpdateProfile());
    },
    dispatch,
  };
}

// const withReducer = injectReducer({ key: 'liveWall', reducer });
const withConnect = connect(mapStateToProps, mapDispatchToProps);



export default compose(
  // withReducer,
  withConnect,  
)(LiveWallPage);
