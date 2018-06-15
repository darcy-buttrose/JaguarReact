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
            />
            <h1>FullScreen</h1>
          </div>
        </span>
      );
    }

    let fullScreenButton = null;
    if (this.props.position !== 'footer') {
      fullScreenButton = (
        <span
          className="fas fa-expand-arrows-alt fa-2x"
          role="presentation"
          onClick={this.props.onToggleLiveWallFullScreen}
        />
      );
    }

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
