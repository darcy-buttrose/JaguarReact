import React, { Component } from 'react';


class LiveWallFullScreen extends Component {
  state = {
    fullScreen: false,
  }

  toggleFullScreenHandler = () => this.setState({ fullScreen: !this.state.fullScreen });

  render() {
    let fullScreen = null;
    if (this.state.fullScreen) {
      fullScreen = (
        <span>
          <object
            className="LiveWallModal"
            src="http://portal-dev:8000/portal/ui/livewall/react/"
            title="livewallfullscreen"
          >
          </object>
          <span
            className="LiveWallModalClose fas fa-times-circle fa-2x"
            role="presentation"
            onClick={this.toggleFullScreenHandler}
          ></span>
        </span>
      );
    }

    return (
      <span className="app-header-item">
        <span
          className="fas fa-expand-arrows-alt fa-2x"
          role="presentation"
          onClick={this.toggleFullScreenHandler}
        ></span>
        {fullScreen}
      </span>
    );
  }
}


export default LiveWallFullScreen;
