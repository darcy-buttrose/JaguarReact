import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import $ from 'jquery';

import appPropTypes from '../../state/App/propTypes';
import authPropTypes from '../../state/Auth/propTypes';
import makeSelectApp from '../../state/App/selectors';
import makeSelectAuth from '../../state/Auth/selectors';

import '../../jQueryComponents/portal-ui';
import '../../jQueryComponents/portal-websockets';
import './styles.scss';

class LiveWallPage extends React.PureComponent {
  componentDidMount() {
    const sessionKey = this.props.auth.user.id_token;

    $(document).ready(() => {
      const livewallContainer = document.getElementById('videowall-container');
      livewallContainer.style.height = '100%';
      $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', () => {
        if (window.portal.runPrefixedMethod(document, 'FullScreen') ||
          window.portal.runPrefixedMethod(document, 'IsFullScreen')) {
          // don't need to do any sizing here, because the element becomes 'full screen'
          // livewallContainer.style.height = '100%';
        } else {
          // livewallContainer.style.height = '87%';
        }
      });
      $('.toggle-full-screen').on('click', () => {
        if (window.portal.runPrefixedMethod(document, 'FullScreen') ||
          window.portal.runPrefixedMethod(document, 'IsFullScreen')) {
          window.portal.runPrefixedMethod(document, 'CancelFullScreen');
        } else {
          window.portal.runPrefixedMethod(livewallContainer, 'RequestFullScreen');
        }
      });
      const videoPaneManager = new window.portal.VideoPaneManager(
        $('.video-wall-cell'),
        {
          onFeedClick: (feedId) => {
            // GEN2-178: navigation to camera historical playback
            //           when a LiveWall video panel is clicked
            // make epoch timestamps for last 24 hours
            const end = new Date().getTime();
            const start = end - (24 * 60 * 60 * 1000);
            // navigation URL - note that we replace the camera PK "on the fly" here so that
            // we can use generated URLs with JavaScript parameters
            let url = '/playback/0'.replace(/0/, feedId);
            // add the start/end query parameters to the URL
            url += `?start=${start}&end=${end}`;
            // head on over to the camera playback view
            document.location = url;
          },
        }
      );
      const debouncedResizeHandler = window.portal.debounce(() => {
        videoPaneManager.refreshSizes();
      }, 150);
      $(window).on('resize', debouncedResizeHandler);

      const cameraviewMapping = {};
      this.props.app.cameraFilters.forEach((filter) => {
        const cameraList = {};
        filter.cameraList.forEach((cameraNumber) => {
          cameraList[cameraNumber] = true;
        });
        cameraviewMapping[filter.name] = cameraList;
      });

      // {
      //   'milestone\u002Dpta': { 390: true, 391: true, 392: true, 393: true, 394: true, 395: true, 396: true, 397: true, 398: true, 399: true, 400: true, 401: true, 402: true },
      //   Glitchy: { 363: true, 364: true, 365: true, 366: true, 367: true, 489: true, 490: true, 491: true, 492: true, 493: true, 494: true, 495: true, 496: true, 497: true, 498: true, 499: true, 500: true, 501: true },
      //   'milestone\u002Dswinburne': { 403: true, 404: true, 405: true, 406: true, 407: true, 408: true, 409: true, 410: true, 411: true, 412: true, 413: true, 414: true, 415: true, 416: true, 417: true, 418: true, 419: true, 420: true, 421: true, 422: true, 423: true, 424: true },
      //   'milestone\u002Dall': { 344: true, 345: true, 346: true, 347: true, 348: true, 349: true, 350: true, 351: true, 352: true, 353: true, 354: true, 355: true, 356: true, 357: true, 358: true, 359: true, 360: true, 361: true, 362: true, 363: true, 364: true, 365: true, 366: true, 367: true, 368: true, 369: true, 370: true, 371: true, 372: true, 373: true, 374: true, 375: true, 376: true, 377: true, 378: true, 379: true, 380: true, 381: true, 382: true, 383: true, 384: true, 385: true, 386: true, 387: true, 388: true, 389: true, 390: true, 391: true, 392: true, 393: true, 394: true, 395: true, 396: true, 397: true, 398: true, 399: true, 400: true, 401: true, 402: true, 403: true, 404: true, 405: true, 406: true, 407: true, 408: true, 409: true, 410: true, 411: true, 412: true, 413: true, 414: true, 415: true, 416: true, 417: true, 418: true, 419: true, 420: true, 421: true, 422: true, 423: true, 424: true, 489: true, 490: true, 491: true, 492: true, 493: true, 494: true, 495: true, 496: true, 497: true, 498: true, 499: true, 500: true, 501: true },
      // };

      videoPaneManager.clearCameraFilter();
      const $noFilterIndicator = $('.no-filter-indicator');
      $('.cameraview-selector').on({
        change: () => {
          const cameraview = $(this).val();
          // GEN2-176/177 require 'splitting' of the filter dropdowns for correct
          // positioning in windowed and full screen modes and, so we need to make sure
          // that both the header and full-screen footer camera view selectors stay in
          // sync with each other
          $('.cameraview-selector').val(cameraview);
          let cameraPks = null;
          if (cameraview !== '*') {
            cameraPks = cameraviewMapping[cameraview];
          }
          if (cameraPks) {
            $noFilterIndicator.hide();
            videoPaneManager.setCameraFilter(cameraPks);
          } else {
            $noFilterIndicator.show();
            videoPaneManager.clearCameraFilter();
          }
        },
      }).change();

      this.props.app.anomalyWebSocketUrls.forEach((anomalyUrl) => {
        new window.portal.WebSockets.LiveWallWebSocket(
          `${anomalyUrl.url}?session_key=${sessionKey}`,
          anomalyUrl.streamBase,
          videoPaneManager
        ).connect();
      });
    });
  }

  renderVideoRow(row, cells) {
    const rows = [];
    const cellWidth = 100 / cells;
    for (let cell = 0; cell < cells; cell += 1) {
      const id = `${row}x${cell}`;
      rows.push(<div key={id} className="video-wall-cell" style={{ width: `${cellWidth}%` }} id={id} >{`${id}`}</div>);
    }
    return rows;
  }

  renderVideoGrid(rows, cells) {
    const grid = [];
    const rowHeight = 100 / rows;
    for (let row = 0; row < rows; row += 1) {
      grid.push(<div key={row} className="row" style={{ height: `${rowHeight}%` }}>{this.renderVideoRow(row, cells)}</div>);
    }
    return grid;
  }

  render() {
    return (
      <div className="livewall-page">
        <div id="videowall-container" className="videowall-container">
          <div className="video-wall">
            {this.renderVideoGrid(3, 3)}
          </div>
        </div>
      </div>
    );
  }
}

LiveWallPage.propTypes = {
  app: PropTypes.shape(appPropTypes),
  auth: PropTypes.shape(authPropTypes),
};

const mapStateToProps = createStructuredSelector({
  app: makeSelectApp(),
  auth: makeSelectAuth(),
});

const withConnect = connect(mapStateToProps);

export default compose(
  withConnect,
)(LiveWallPage);
