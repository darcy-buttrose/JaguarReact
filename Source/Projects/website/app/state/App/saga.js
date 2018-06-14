import { call, put, takeLatest } from 'redux-saga/effects';
import { getConfig } from '../../services/config';
import {
  loadConfigSuccess,
  loadConfigFailure,
  updateCameraFiltersSuccess,
  updateCameraFiltersFailure,
  updateWebSocketUrlsSuccess,
  updateWebSocketUrlsFailure,
} from './actions';
import {
  CONFIG_REQUEST_INIT,
  CAMERA_FILTERS_UPDATE_INIT,
  WEBSOCKET_URLS_UPDATE_INIT,
} from './constants';


function* fetchConfig() {
  try {
    const config = yield call(getConfig);
    yield put(loadConfigSuccess(config));
  } catch (e) {
    yield put(loadConfigFailure(e.message));
  }
}


function* fetchCameraFilters(cameraFilterApi) {
  try {
    const cameraFilterData = yield cameraFilterApi.create();
    const cameraFilters = yield call(cameraFilterData.getCameraFilter);
    yield put(updateCameraFiltersSuccess(cameraFilters));
  } catch (e) {
    yield put(updateCameraFiltersFailure(e.message));
  }
}

function* fetchWebSocketUrls(anomalyApi) {
  try {
    const anomalyData = yield anomalyApi.create();
    const webSocketUrls = yield call(anomalyData.getWebSocketUrls);
    yield put(updateWebSocketUrlsSuccess(webSocketUrls));
  } catch (e) {
    yield put(updateWebSocketUrlsFailure(e.message));
  }
}

function appSagaBuilder(apis) {
  return function* appSaga() {
    yield takeLatest(CONFIG_REQUEST_INIT, fetchConfig);
    yield takeLatest(CAMERA_FILTERS_UPDATE_INIT, fetchCameraFilters, apis.cameraFilterApi);
    yield takeLatest(WEBSOCKET_URLS_UPDATE_INIT, fetchWebSocketUrls, apis.anomalyApi);
  };
}

export default appSagaBuilder;
