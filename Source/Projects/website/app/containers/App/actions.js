/*
 *
 * Global actions
 *
 */

import {
  COUNTRIES_REQUEST_INIT,
  COUNTRIES_REQUEST_SUCCESS,
  COUNTRIES_REQUEST_FAILURE,
} from './constants';

/**
 * [countriesStart description]
 * @return {[type]} [description]
 */
export function countriesStart() {
  return {
    type: COUNTRIES_REQUEST_INIT,
  };
}

/**
 * [countriesSuccess description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function countriesSuccess(data) {
  return {
    type: COUNTRIES_REQUEST_SUCCESS,
    data,
  };
}

/**
 * [countriesFailure description]
 * @param  {[type]} error [description]
 * @return {[type]}       [description]
 */
export function countriesFailure(error) {
  return {
    type: COUNTRIES_REQUEST_FAILURE,
    error,
  };
}
