import React from 'react';
import $ from 'jquery';
import '../../jQueryComponents/portal-timeline';
import './styles.scss';

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
        <h1>LiveWaLL</h1>
        <div id="videowall-container" className="videowall-container">
          <div className="container videowall">
            <div className="row">
              <div className="four columns video-wall-cell" id="0x0" >0x0</div>
              <div className="four columns video-wall-cell" id="1x0" >1x0</div>
              <div className="four columns video-wall-cell" id="2x0" >2x0</div>
            </div>
            <div className="row">
              <div className="four columns video-wall-cell" id="0x1" >0x1</div>
              <div className="four columns video-wall-cell" id="1x1" >1x1</div>
              <div className="four columns video-wall-cell" id="2x1" >2x1</div>
            </div>
            <div className="row">
              <div className="four columns video-wall-cell" id="0x2" >0x2</div>
              <div className="four columns video-wall-cell" id="1x2" >1x2</div>
              <div className="four columns video-wall-cell" id="2x2" >2x2</div>
            </div>
          </div>
        </div>
        <h1>Playback</h1>
        <div id="timeline-container" style={{ padding: '8px 0' }} />
      </div>
    );
  }
}

export default PlaybackPage;
