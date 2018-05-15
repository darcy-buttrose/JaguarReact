/*
 *
 * LiveWall reducer
 *
 */

import { fromJS } from 'immutable';

import {
  LOGIN_REQUEST_INIT,
  LOGIN_REQUEST_SUCCESS,
  LOGIN_REQUEST_FAILURE,
  LOGOUT,
} from './constants';

const initialState = fromJS({
  token: '',
  isAuthenticated: false,
  isAuthenticating: false,
  showError: false,
  errorMessage: null,
});

/**
 * [authReducer description]
 * @param  {[type]} [state=initialState] [description]
 * @param  {[type]} action               [description]
 * @return {[type]}                      [description]
 */
function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_REQUEST_INIT:
      return state
        .set('isAuthenticating', true);
    case LOGIN_REQUEST_SUCCESS:
      return state
      .set('token', action.token)
      .set('isAuthenticating', false)
      .set('isAuthenticated', true);
    case LOGIN_REQUEST_FAILURE:
      return state
      .set('isAuthenticating', false)
      .set('showError', true)
      .set('errorMessage', action.error);
    case LOGOUT:
      return state
      .set('token', null)
      .set('isAuthenticated', false)
      .set('showError', false)
      .set('errorMessage', null);
    default:
      return state;
  }
}

export default authReducer;
