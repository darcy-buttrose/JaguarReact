import {
  CONFIG_REQUEST_INIT,
  CONFIG_REQUEST_SUCCESS,
  CONFIG_REQUEST_FAILURE,
  CAMERA_FILTERS_UPDATE_INIT,
  CAMERA_FILTERS_UPDATE_SUCCESS,
  CAMERA_FILTERS_UPDATE_FAILURE,
} from './constants';

export function startLoadConfig() {
  return { type: CONFIG_REQUEST_INIT };
}

export function loadConfigSuccess(config) {
  return { type: CONFIG_REQUEST_SUCCESS, config };
}

export function loadConfigFailure(error) {
  return { type: CONFIG_REQUEST_FAILURE, error };
}


export function updateCameraFiltersSuccess(filters) {
  return { type: CAMERA_FILTERS_UPDATE_SUCCESS, filters };
}

export function updateCameraFiltersFailure(error) {
  return { type: CAMERA_FILTERS_UPDATE_FAILURE, error };
}

export function startUpdateCameraFilters() {
  return {
    type: CAMERA_FILTERS_UPDATE_INIT
  };
}