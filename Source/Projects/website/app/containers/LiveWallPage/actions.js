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
export function loginSuccess(token) {
  return {
    type: LOGIN_REQUEST_SUCCESS,
    token,
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
