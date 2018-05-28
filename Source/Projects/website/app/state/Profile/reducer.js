/*
 *
 * Profile reducer
 *
 */

import { fromJS } from 'immutable';

import {
  CHANGE_THEME,
} from './constants';

const initialState = fromJS({
  currentTheme: 'daylight',
  showError: false,
  errorMessage: null,
});

function profileReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_THEME:
      return state
        .set('currentTheme', action.item);
    default:
      return state;
  }
}

export default profileReducer;
