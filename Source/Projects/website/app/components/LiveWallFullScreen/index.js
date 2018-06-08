import React, { Component } from 'react';


class LiveWallFullScreen extends Component {
  state = {
    fullScreen: true,
  }

  toggleFullScreenHandler = () => this.setState({ fullScreen: !this.state.fullScreen });

  render() {
    let fullScreen = null;
    if (this.state.fullScreen) {
      fullScreen = (
        <object
          className="Modal"
          src="http://10.1.1.73:8000/portal/ui/livewall/react/"
          title="livewallfullscreen"
        ></object>
    );
    }

    return (
      <span>
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
