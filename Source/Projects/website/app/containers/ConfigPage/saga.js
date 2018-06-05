import { call, select, put, takeLatest } from 'redux-saga/effects';
import { LOAD_CAMERA_LIST_INIT } from './constants';
import cameraListApi from '../../services/cameraList';
import { loadCameraListSuccess, loadCameraListFailure } from './actions';

function* fetchCameraList() {
  try {
    const state = yield select();
    const app = state.get('app').toJS();
    const auth = state.get('auth').toJS();
    const apiUrl = app.config.clientAppSettings.apiScheme + app.config.clientAppSettings.apiUrl;
    const idToken = auth.user.id_token;
    const cameraListData = cameraListApi.create(apiUrl, idToken);
    const cameraLists = yield call(cameraListData.getCameraList);
    yield put(loadCameraListSuccess(cameraLists));
  } catch (e) {
    yield put(loadCameraListFailure(e.message));
  }
}

function* cameraListSaga() {
  yield takeLatest(LOAD_CAMERA_LIST_INIT, fetchCameraList);
}

export default cameraListSaga;
