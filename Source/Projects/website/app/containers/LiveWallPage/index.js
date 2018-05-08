import React from 'react';
import Iframe from 'react-iframe';

class LiveWallPage extends React.PureComponent {
  render() {
    return (
      <Iframe
        url="http://10.1.1.73:8000/portal/ui/livewall/react/"
        id="django-livewall-iframe"
        display="flex"
        position="relative"
        allowFullScreen
      />
    );
  }
}

export default LiveWallPage;
