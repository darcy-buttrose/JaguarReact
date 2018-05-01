/*
 *
 * Navbar reducer
 *
 */

import { fromJS } from 'immutable';

import {
  NAVBAR_OPEN,
  NAVBAR_CLOSE,
} from './constants';

const initialState = fromJS({
  isOpen: false,
});

/**
 * [navbarReducer description]
 * @param  {[type]} [state=initialState] [description]
 * @param  {[type]} action               [description]
 * @return {[type]}                      [description]
 */
function navbarReducer(state = initialState, action) {
  switch (action.type) {
    case NAVBAR_OPEN:
      return state
        .set('isOpen', true);
    case NAVBAR_CLOSE:
      return state
        .set('isOpen', false);
    default:
      return state;
  }
}

export default navbarReducer;
