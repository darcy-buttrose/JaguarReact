import { call, put, takeLatest } from 'redux-saga/effects';
import { getConfig } from '../../services/config';
import {
  loadConfigSuccess,
  loadConfigFailure,
  updateCameraFiltersSuccess,
  updateCameraFiltersFailure,
} from './actions';
import { CONFIG_REQUEST_INIT, CAMERA_FILTERS_UPDATE_INIT } from './constants';


function* fetchConfig() {
  try {
    const config = yield call(getConfig);
    yield put(loadConfigSuccess(config));
  } catch (e) {
    yield put(loadConfigFailure(e.message));
  }
}


function* fetchCameraFilters(cameraFilterApi, apiUrlProvider, authTokenProvider) {
  try {
    const apiUrl = yield apiUrlProvider();
    const idToken = yield authTokenProvider();
    const cameraFilterData = cameraFilterApi.create(apiUrl, idToken);
    const cameraFilters = yield call(cameraFilterData.getCameraFilter);
    yield put(updateCameraFiltersSuccess(cameraFilters));
  } catch (e) {
    yield put(updateCameraFiltersFailure(e.message));
  }
}

function appSagaBuilder(cameraFilterApi, apiUrlProvider, authTokenProvider) {
  return function* appSaga() {
    yield takeLatest(CONFIG_REQUEST_INIT, fetchConfig);
    yield takeLatest(CAMERA_FILTERS_UPDATE_INIT, fetchCameraFilters, cameraFilterApi, apiUrlProvider, authTokenProvider);
  };
}

export default appSagaBuilder;
