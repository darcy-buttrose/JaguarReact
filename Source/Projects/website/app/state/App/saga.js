import { call, put, select, takeLatest } from 'redux-saga/effects';
import { getConfig } from '../../services/config';
import {
  loadConfigSuccess,
  loadConfigFailure,
  updateCameraFiltersSuccess,
  updateCameraFiltersFailure,
} from './actions';
import { CONFIG_REQUEST_INIT, CAMERA_FILTERS_UPDATE_INIT } from './constants';
import cameraFilterApi from '../../services/cameraFilter';


function* fetchConfig() {
  try {
    const config = yield call(getConfig);
    yield put(loadConfigSuccess(config));
  } catch (e) {
    yield put(loadConfigFailure(e.message));
  }
}


function* fetchCameraFilters() {
  try {
    const state = yield select();
    const app = state.get('app').toJS();
    const auth = state.get('auth').toJS();
    const apiUrl = app.config.clientAppSettings.apiScheme + app.config.clientAppSettings.apiUrl;
    const idToken = auth.user.id_token;
    const cameraFilterData = cameraFilterApi.create(apiUrl, idToken);
    const cameraFilters = yield call(cameraFilterData.getCameraFilter);
    yield put(updateCameraFiltersSuccess(cameraFilters));
  } catch (e) {
    yield put(updateCameraFiltersFailure(e.message));
  }
}


function* appSaga() {
  yield takeLatest(CONFIG_REQUEST_INIT, fetchConfig);
  yield takeLatest(CAMERA_FILTERS_UPDATE_INIT, fetchCameraFilters);
}

export default appSaga;
