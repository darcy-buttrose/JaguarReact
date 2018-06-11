import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';


class LiveWallFullScreen extends PureComponent {
  render() {
    let fullScreen = null;
    if (this.props.fullScreen) {
      fullScreen = (
        <span>
          <div className="LiveWallModal">
            <span
              className="LiveWallModalClose fas fa-times-circle"
              role="presentation"
              onClick={this.props.onToggleLiveWallFullScreen}
            ></span>
            <object
              className="LiveWallModal-content"
              data="http://localhost:8000/portal/ui/livewall/react/"
              title="livewallfullscreen"
            >
            </object>
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
    if (this.props.fullScreen || this.props.position === 'footer') fullScreenButton = null;

    return (
      <span className="app-header-item">
        {fullScreenButton}
        {fullScreen}
      </span>
    );
  }
}


LiveWallFullScreen.propTypes = {
  fullScreen: PropTypes.bool,
  position: PropTypes.string,
  onToggleLiveWallFullScreen: PropTypes.func,
};


export default LiveWallFullScreen;
