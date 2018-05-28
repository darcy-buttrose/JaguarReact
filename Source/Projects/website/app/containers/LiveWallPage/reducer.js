/*
 *
 * LiveWall reducer
 *
 */

import { fromJS } from 'immutable';

import {
  LIVEWALL_UPDATE_CAMERAFILTER,
  LIVEWALL_CLEAR_CAMERAFILTER,
} from './constants';

const initialState = fromJS({
  filter: 0
});


function liveWallReducer(state = initialState, action) {
  switch (action.type) {
    case LIVEWALL_UPDATE_CAMERAFILTER:
      return state
        .set('filter', action.filter);
    case LIVEWALL_CLEAR_CAMERAFILTER:
      return state
        .set('filter', initialState.get('filter'));
    default:
      return state;
  }
}

export default liveWallReducer;
