/*
 *
 * Auth reducer
 *
 */

import { fromJS } from 'immutable';

import {
  LOGIN_REQUEST_INIT,
  LOGIN_REQUEST_SUCCESS,
  LOGIN_REQUEST_FAILURE,
  LOGOUT,
  UPDATE_PROFILE_INIT,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
} from './constants';

const initialState = fromJS({
  user: null,
  userName: null,
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
        .set('isAuthenticating', true)
        .set('showError', false)
        .set('errorMessage', '');
    case UPDATE_PROFILE_INIT:
      return state
        .set('showError', false)
        .set('errorMessage', '');
    case LOGIN_REQUEST_SUCCESS:
      return state
        .set('user', action.user)
        .set('userName', action.user.profile.name)
        .set('isAuthenticating', false)
        .set('isAuthenticated', true);
    case UPDATE_PROFILE_SUCCESS:
      return state
        .set('userName', action.profile.username);
//        .setIn(['user', 'profile'], fromJS(action.profile));
    case LOGIN_REQUEST_FAILURE:
      return state
      .set('isAuthenticating', false)
      .set('showError', true)
      .set('errorMessage', action.error);
    case UPDATE_PROFILE_FAILURE:
      return state
      .set('showError', true)
      .set('errorMessage', action.error);
    case LOGOUT:
      return state
      .set('user', null)
      .set('userName', null)
      .set('isAuthenticated', false)
      .set('showError', false)
      .set('errorMessage', null);
    default:
      return state;
  }
}

export default authReducer;
