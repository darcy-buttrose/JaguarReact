/*
 *
 * Countries reducer
 *
 */

import { fromJS } from 'immutable';

import {
  COUNTRIES_REQUEST_INIT,
  COUNTRIES_REQUEST_SUCCESS,
  COUNTRIES_REQUEST_FAILURE,
} from './constants';

const initialState = fromJS({
  countries: null,
  showError: false,
  errorMessage: null,
});

/**
 * [countriesReducer description]
 * @param  {[type]} [state=initialState] [description]
 * @param  {[type]} action               [description]
 * @return {[type]}                      [description]
 */
function appReducer(state = initialState, action) {
  switch (action.type) {
    case COUNTRIES_REQUEST_INIT:
      return state
        .set('showError', false)
        .set('errorMessage', null);
    case COUNTRIES_REQUEST_SUCCESS:
      return state
      .set('countries', action.data)
      .set('showError', false)
      .set('errorMessage', null);
    case COUNTRIES_REQUEST_FAILURE:
      return state
      .set('countries', null)
      .set('showError', true)
      .set('errorMessage', action.error);
    default:
      return state;
  }
}

export default appReducer;
