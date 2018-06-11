/*
 *
 * LiveWall reducer
 *
 */

import { fromJS } from 'immutable';

import {
  LIVEWALL_UPDATE_CAMERAFILTER,
  LIVEWALL_CLEAR_CAMERAFILTER,
  LIVEWALL_TOGGLE_FULLSCREEN,
} from './constants';

const initialState = fromJS({
  filter: 0,
  fullScreen: false,
});


function liveWallReducer(state = initialState, action) {
  switch (action.type) {
    case LIVEWALL_UPDATE_CAMERAFILTER:
      return state
        .set('filter', action.filter);
    case LIVEWALL_CLEAR_CAMERAFILTER:
      return state
        .set('filter', initialState.get('filter'));
    case LIVEWALL_TOGGLE_FULLSCREEN:
      return state
        .set('fullScreen', !state.get('fullScreen'));
    default:
      return state;
  }
}

export default liveWallReducer;
