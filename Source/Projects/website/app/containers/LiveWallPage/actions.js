/*
 *
 * LiveWall actions
 *
 */

import {
  LIVEWALL_UPDATE_CAMERAFILTER,
  LIVEWALL_CLEAR_CAMERAFILTER,
  LIVEWALL_TOGGLE_FULLSCREEN,
} from './constants';


/**
 * [loginStart description]
 * @return {[type]} [description]
 */
export function setFilter(filter) {
  return {
    type: LIVEWALL_UPDATE_CAMERAFILTER,
    filter,
  };
}

/**
 * [loginSuccess description]
 * @param  {[type]} user [description]
 * @return {[type]}      [description]
 */
export function clearFilter() {
  return {
    type: LIVEWALL_CLEAR_CAMERAFILTER,
  };
}


/**
 * [toggleFullScreen allow the user to see the LiveWall in full screen mode or dismiss it]
 *
 */
export function toggleFullScreen() {
  return {
    type: LIVEWALL_TOGGLE_FULLSCREEN,
  };
}
