import Iframe from 'react-iframe';
import frameChannels from 'frame-channels';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import makeSelectApp from '../../state/App/selectors';
import appPropTypes from '../../state/App/propTypes';

class PlaybackWallPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.channelHandler = this.channelHandler.bind(this);

    const { config } = props.app;
    this.channel = frameChannels.create(config.clientAppSettings.channel, { target: '#django-Playback-iframe' });
    this.channel.subscribe(this.channelHandler);
  }

  componentWillUnmount() {
    if (this.channelHandler) {
      this.channel.unsubscribe(this.channelHandler);
    }
  }

  channelHandler(msg) {
    console.log('playback channel message', msg);
  }

  render() {
    const { config } = this.props.app;

    if (config) {
      const djangoPlaybackUrl = `http://${config.clientAppSettings.djangoUrl}portal/ui/playback/wall/react/`;

      return (
        <div className="django-iframe">
          <Iframe
            url={djangoPlaybackUrl}
            id="django-Playback-iframe"
            display="flex"
            position="relative"
            allowFullScreen
          />
        </div>
      );
    }
    return null;
  }
}

PlaybackWallPage.propTypes = {
  app: PropTypes.shape(appPropTypes),
};

const mapStateToProps = createStructuredSelector({
  app: makeSelectApp(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackWallPage);
