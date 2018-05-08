import React from 'react';
import Iframe from 'react-iframe';
import frameChannels from 'frame-channels';

class LiveWallPage extends React.PureComponent {
  constructor() {
    super();
    this.goChannel = this.goChannel.bind(this);
    this.channel = frameChannels.create('my-channel', { target: '#django-livewall-iframe' });
    this.channel.subscribe((msg) => {
      console.log('Outer Got', msg);
    });
  }

  goChannel() {
    this.channel.push({ hello: 'world' });
  }

  // django url: http://localhost:8000/portal/ui/livewall/react/
  render() {
    return (
      <div>
        <Iframe
          url="http://localhost:3000/livewall-inner"
          id="django-livewall-iframe"
          display="flex"
          position="relative"
          allowFullScreen
        />
        <button onClick={this.goChannel}>Outer</button>
      </div>
    );
  }
}

export default LiveWallPage;
