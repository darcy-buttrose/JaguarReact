import { fromJS } from 'immutable';
import {
  CONFIG_REQUEST_INIT,
  CONFIG_REQUEST_SUCCESS,
  CONFIG_REQUEST_FAILURE,
  CAMERA_FILTERS_UPDATE_INIT,
  CAMERA_FILTERS_UPDATE_SUCCESS,
  CAMERA_FILTERS_UPDATE_FAILURE,
  LIVEWALL_FULLSCREEN,
} from './constants';

const initialState = fromJS({
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
  liveWallFullScreen: false,
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
    case LIVEWALL_FULLSCREEN:
      return state
        .set('liveWallFullScreen', true);
    default:
      return state;
  }
};

export default appReducer;
