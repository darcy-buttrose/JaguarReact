import React from 'react';
import frameChannels from 'frame-channels';

class LiveWallInnerPage extends React.PureComponent {
  constructor() {
    super();
    this.goChannel = this.goChannel.bind(this);
    this.channel = frameChannels.create('my-channel', { target: window.parent });
    this.channel.subscribe((msg) => {
      console.log('Inner Got', msg);
    });
  }

  goChannel() {
    this.channel.push({ hello: 'parent' });
  }

  render() {
    return (
      <div><button onClick={this.goChannel}>Inner</button></div>
    );
  }
}

export default LiveWallInnerPage;

