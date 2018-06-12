import React from 'react';
import $ from 'jquery';
import '../../jQueryComponents/portal-timeline';

class PlaybackPage extends React.PureComponent {
  componentDidMount() {
    console.log('componentDidMount');
    $(document).ready(() => {
      console.log('READY');
      const timeLineOptions = {
        // we only encode the first 3 mins of video, so restrict the rendered duration to
        // that amount
        maxRenderedDuration: 3 * 60 * 1000,
        nowIndicatorPosition: 1.0 / 3.0,
      };
      this.timelineWidget = new window.portal.Timeline(document.getElementById('timeline-container'), timeLineOptions);
    });
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
  }

  render() {
    return (
      <div className="playback-page">
        <div id="timeline-container" style={{ padding: '8px 0' }} />
      </div>
    );
  }
}

export default PlaybackPage;
