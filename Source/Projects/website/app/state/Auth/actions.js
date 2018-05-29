/*
 *
 * Auth actions
 *
 */

import {
  LOGIN_REQUEST_INIT,
  LOGIN_REQUEST_SUCCESS,
  LOGIN_REQUEST_FAILURE,
  LOGOUT,
  UPDATE_PROFILE_INIT,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  UPDATE_TOKEN,
} from './constants';

/**
 * [loginStart description]
 * @return {[type]} [description]
 */
export function loginStart() {
  return {
    type: LOGIN_REQUEST_INIT,
  };
}

/**
 * [loginSuccess description]
 * @param  {[type]} user [description]
 * @return {[type]}      [description]
 */
export function loginSuccess(user) {
  return {
    type: LOGIN_REQUEST_SUCCESS,
    user,
  };
}

/**
 * [loginFailure description]
 * @param  {[type]} error [description]
 * @return {[type]}       [description]
 */
export function loginFailure(error) {
  return {
    type: LOGIN_REQUEST_FAILURE,
    error,
  };
}

/**
 * [logout description]
 * @return {[type]} [description]
 */
export function logout() {
  return {
    type: LOGOUT,
  };
}

export function startUpdateProfile(options) {
  return {
    type: UPDATE_PROFILE_INIT,
    options,
  };
}

export function updateProfileSuccess(profile) {
  return {
    type: UPDATE_PROFILE_SUCCESS,
    profile,
  };
}

export function updateProfileFailure(error) {
  return {
    type: UPDATE_PROFILE_FAILURE,
    error,
  };
}

export function updateToken(token) {
  return {
    type: UPDATE_TOKEN,
    token,
  };
}


