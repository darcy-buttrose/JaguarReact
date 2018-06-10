import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/lib/connect/connect';

import { createStructuredSelector } from 'reselect';
import liveWallFullScreenPropTypes from './propTypes';
import routePropTypes from '../../state/Route/propTypes';
import makeSelectRoute from '../../state/Route/selectors';
import makeSelectLiveWallFullScreen from './selectors';
import { LIVEWALL_FULLSCREEN } from './actions';
import StatusBar from '../StatusBar';


class LiveWallFullScreen extends PureComponent {
  render() {
    let isLiveWall = false;
    if (this.props.route.location.pathname === '/livewall') isLiveWall = true;

    let fullScreen = null;
    if (this.props.liveWallFullScreen.fullScreen && isLiveWall) {
      fullScreen = (
        <span>
          <div className="LiveWallModal">
            <span
              className="LiveWallModalClose fas fa-times-circle fa-2x"
              role="presentation"
              onClick={this.props.onToggleLiveWallFullScreen}
            ></span>
            <object
              className="LiveWallModal-content"
              data="http://localhost:8000/portal/ui/livewall/react/"
              title="livewallfullscreen"
            >
            </object>
            <StatusBar />
          </div>
        </span>
      );
    }

    let fullScreenButton = (
      <span
        className="fas fa-expand-arrows-alt fa-2x"
        role="presentation"
        onClick={this.props.onToggleLiveWallFullScreen}
      ></span>
    );
    if (!isLiveWall || this.props.liveWallFullScreen.fullScreen) fullScreenButton = null;

    return (
      <span className="app-header-item">
        {fullScreenButton}
        {fullScreen}
      </span>
    );
  }
}


LiveWallFullScreen.propTypes = {
  route: PropTypes.shape(routePropTypes),
  liveWallFullScreen: PropTypes.shape(liveWallFullScreenPropTypes),
  onToggleLiveWallFullScreen: PropTypes.func,
};


// const mapStateToProps = (state) => ({
//   fullScreen: this.props.fullScreen,
// });
const mapStateToProps = createStructuredSelector({
  route: makeSelectRoute(),
  liveWallFullScreen: makeSelectLiveWallFullScreen(),
});

const mapDispatchToProps = (dispatch) => ({
  onToggleLiveWallFullScreen: () => dispatch({ type: LIVEWALL_FULLSCREEN }),
  dispatch,
});


export default connect(mapStateToProps, mapDispatchToProps)(LiveWallFullScreen);
