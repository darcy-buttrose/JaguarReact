import { fromJS } from 'immutable';
import {
  CONFIG_REQUEST_INIT,
  CONFIG_REQUEST_SUCCESS,
  CONFIG_REQUEST_FAILURE,
  CAMERA_FILTERS_UPDATE_INIT,
  CAMERA_FILTERS_UPDATE_SUCCESS,
  CAMERA_FILTERS_UPDATE_FAILURE,
  WEBSOCKET_URLS_UPDATE_INIT,
  WEBSOCKET_URLS_UPDATE_SUCCESS,
  WEBSOCKET_URLS_UPDATE_FAILURE,
} from './constants';

export const initialState = fromJS({
  config: null,
  isReady: false,
  isInitialising: false,
  showError: false,
  errorMessage: null,
  cameraFilters: [
    {
      id: 0,
      name: 'All Cameras',
    },
  ],
  anomalyWebSocketUrls: [],
});

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONFIG_REQUEST_INIT:
      return state
        .set('isReady', false)
        .set('isInitialising', true)
        .set('config', null)
        .set('showError', false)
        .set('errorMessage', null);
    case CONFIG_REQUEST_SUCCESS:
      return state
        .set('isReady', true)
        .set('isInitialising', false)
        .set('config', action.config);
    case CONFIG_REQUEST_FAILURE:
      return state
        .set('isInitialising', false)
        .set('showError', true)
        .set('errorMessage', action.error);
    case CAMERA_FILTERS_UPDATE_INIT:
      return state
        .set('showError', false)
        .set('errorMessage', null);
    case CAMERA_FILTERS_UPDATE_SUCCESS:
      return state
        .set('cameraFilters', action.filters);
    case CAMERA_FILTERS_UPDATE_FAILURE:
      return state
        .set('showError', true)
        .set('errorMessage', action.error);
    case WEBSOCKET_URLS_UPDATE_INIT:
      return state
        .set('showError', false)
        .set('errorMessage', null);
    case WEBSOCKET_URLS_UPDATE_SUCCESS:
      return state
        .set('anomalyWebSocketUrls', action.urls);
    case WEBSOCKET_URLS_UPDATE_FAILURE:
      return state
        .set('showError', true)
        .set('errorMessage', action.error);
    default:
      return state;
  }
};

export default appReducer;
