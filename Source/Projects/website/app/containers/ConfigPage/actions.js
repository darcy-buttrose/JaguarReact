import {
  LOAD_CAMERA_LIST_INIT,
  LOAD_CAMERA_LIST_SUCCESS,
  LOAD_CAMERA_LIST_FAILURE,
} from './constants';

export function startLoadCameraList() {
  return {
    type: LOAD_CAMERA_LIST_INIT,
  };
}

export function loadCameraListSuccess(cameraList) {
  return {
    type: LOAD_CAMERA_LIST_SUCCESS,
    cameraList,
  };
}

export function loadCameraListFailure(error) {
  return {
    type: LOAD_CAMERA_LIST_FAILURE,
    error,
  };
}
