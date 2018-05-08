import React from 'react';
import Iframe from 'react-iframe';
import frameChannels from 'frame-channels'


class LiveWallPage extends React.PureComponent {
  constructor() {
    super();
    this.goChannel = this.goChannel.bind(this);
  }

  goChannel() {
    var channel = frameChannels.create('my-channel', {
      // iframe selector or window object
      target: '#my-iframe',
      // (optional) restrict message origin
      originFilter: /^http\:\/\/domain\.com\//,
      // (optional) timeout when waiting for a message response
      responseTimeout: 30000,
      // (optional) let the iframe control it's positioning with messages
      allowPositionControl: true,
      // (optional) indicate how to create the iframe if it doesn't exists
      iframe: {
        id: 'my-iframe',
        url: 'http://localhost:8000/portal/ui/livewall/react/',
        setup: function(element) {
          channel.iframe.size(180, 50);
          channel.iframe.dock('bottom-right');
          // iframe is invisible by default
          channel.iframe.show();
        }
      }
    });
     
    channel.iframe.ready().then(function(){
      channel.push({ hello: 'world' });
      channel.subscribe(function(msg){
        console.log('got', msg);
      });
    });
  }

  render() {
    return (
      <div>
        {/* <Iframe
          url="http://localhost:8000/portal/ui/livewall/react/"
          id="django-livewall-iframe"
          display="flex"
          position="relative"
          allowFullScreen
        /> */}
        <button onClick={this.goChannel} />
      </div>
    );
  }
}

export default LiveWallPage;
