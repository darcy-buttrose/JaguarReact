import {
  CONFIG_REQUEST_INIT,
  CONFIG_REQUEST_SUCCESS,
  CONFIG_REQUEST_FAILURE,
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
