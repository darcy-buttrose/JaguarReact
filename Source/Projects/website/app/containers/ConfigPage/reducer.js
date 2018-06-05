import { fromJS } from 'immutable';
import {
  LOAD_CAMERA_LIST_INIT,
  LOAD_CAMERA_LIST_SUCCESS,
  LOAD_CAMERA_LIST_FAILURE,
} from './constants';


const initialState = {
  cameraList: [],
  showError: false,
  errorMessage: '',
};

function configReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_CAMERA_LIST_INIT:
      return state
        .set('cameraList', fromJS(initialState.cameraList))
        .set('showError', false)
        .set('errorMessage', '');
    case LOAD_CAMERA_LIST_SUCCESS:
      return state
        .set('cameraList', fromJS(action.cameraList));
    case LOAD_CAMERA_LIST_FAILURE:
      return state
        .set('showError', true)
        .set('errorMessage', action.error);
    default:
      return state;
  }
}

export default configReducer;
