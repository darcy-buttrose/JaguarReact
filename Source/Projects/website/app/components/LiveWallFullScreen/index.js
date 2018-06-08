import React, { PureComponent } from 'react';
import liveWallFullScreenButton from '../LiveWallFullScreenButton';


class LiveWallFullScreen extends PureComponent {

  render() {
    return (
      <span>
        <liveWallFullScreenButton />
        <iframe src="https://www.w3schools.com" title="livewallfullscreen">
        </iframe>
      </span>
    );
  }
}


export default LiveWallFullScreen;
