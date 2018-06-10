import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/lib/connect/connect';

import { createStructuredSelector } from 'reselect';
import liveWallFullScreenPropTypes from './propTypes';
import makeSelectLiveWallFullScreen from './selectors';
import { LIVEWALL_FULLSCREEN } from './actions';


class LiveWallFullScreen extends PureComponent {
  render() {
    console.log('LiveWallFullScreen::liveWallFullScreen:: ', this.props.liveWallFullScreen.fullScreen);
    let fullScreen = null;
    if (this.props.liveWallFullScreen.fullScreen) {
      fullScreen = (
        <span>
          <div className="LiveWallModal">
            <span
              className="LiveWallModalClose fas fa-times-circle fa-2x"
              role="presentation"
              onClick={this.props.onToggleLiveWallFullScreen}
            ></span>
            <object
              className="LiveWallModal"
              src="http://localhost:8000/portal/ui/livewall/react/"
              title="livewallfullscreen"
            >
            </object>
          </div>
        </span>
      );
    }

    const fullScreenButton = (
      <span
        className="fas fa-expand-arrows-alt fa-2x"
        role="presentation"
        onClick={this.props.onToggleLiveWallFullScreen}
      ></span>
    );

    return (
      <span className="app-header-item">
        {fullScreenButton}
        {fullScreen}
      </span>
    );
  }
}


LiveWallFullScreen.propTypes = {
  // position: PropTypes.string,
  liveWallFullScreen: PropTypes.shape(liveWallFullScreenPropTypes),
  onToggleLiveWallFullScreen: PropTypes.func,
};


// const mapStateToProps = (state) => ({
//   fullScreen: this.props.fullScreen,
// });
const mapStateToProps = createStructuredSelector({
  liveWallFullScreen: makeSelectLiveWallFullScreen(),
});

const mapDispatchToProps = (dispatch) => ({
  onToggleLiveWallFullScreen: () => dispatch({ type: LIVEWALL_FULLSCREEN }),
});


export default connect(mapStateToProps, mapDispatchToProps)(LiveWallFullScreen);
