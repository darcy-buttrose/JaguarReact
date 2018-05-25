import { fromJS } from 'immutable';
import {
  CONFIG_REQUEST_INIT,
  CONFIG_REQUEST_SUCCESS,
  CONFIG_REQUEST_FAILURE,
} from './constants';

const initialState = fromJS({
  config: null,
  isReady: false,
  isInitialising: false,
  showError: false,
  errorMessage: null,
});

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONFIG_REQUEST_INIT:
      return state
        .set('isReady', false)
        .set('isInitialising', true)
        .set('config', null)
        .set('showError', false)
        .set('errorMessage', null);
    case CONFIG_REQUEST_SUCCESS:
      return state
        .set('isReady', true)
        .set('isInitialising', false)
        .set('config', action.config);
    case CONFIG_REQUEST_FAILURE:
      return state
        .set('isInitialising', false)
        .set('showError', true)
        .set('errorMessage', action.error);
    default:
      return state;
  }
};

export default appReducer;
