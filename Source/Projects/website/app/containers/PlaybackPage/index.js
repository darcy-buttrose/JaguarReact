import React from 'react';
import userIsAuthenticated from 'utils/userIsAuthenticated';

export class PlaybackWallPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <h1>This is the playback page.</h1>
    );
  }
}

export default userIsAuthenticated(PlaybackWallPage);
