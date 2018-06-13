import appReducer from '../reducer';
import {
  updateCameraFiltersSuccess,
  updateWebSocketUrlsSuccess,
} from '../actions';

describe('appReducer', () => {
  it('should set CameraFilters on CAMERA_FILTERS_UPDATE_SUCCESS', () => {
    const testFilters = [
      {
        id: 0,
        name: 'zero',
      },
      {
        id: 1,
        name: 'one',
      },
    ];

    const result = appReducer(undefined, updateCameraFiltersSuccess(testFilters));
    expect(result.get('cameraFilters')).toEqual(testFilters);
  });

  it('should set AnomalyWebSocketUrls on WEBSOCKET_URLS_UPDATE_SUCCESS', () => {
    const testUrls = [
      {
        url: 'wss://trillian/websocket/events/',
        streamBase: '/portal/streaming/soap_stream/',
      },
      {
        url: 'wss://regression1/websocket/events/',
        streamBase: '/portal/streaming/soap_stream/',
      },
    ];

    const result = appReducer(undefined, updateWebSocketUrlsSuccess(testUrls));
    expect(result.get('anomalyWebSocketUrls')).toEqual(testUrls);
  });
});
