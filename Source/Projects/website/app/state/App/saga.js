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

function* fetchWebSocketUrls(anomalyApi, apiUrlProvider, authTokenProvider) {
  try {
    const apiUrl = yield apiUrlProvider();
    const idToken = yield authTokenProvider();
    const anomalyData = anomalyApi.create(apiUrl, idToken);
    const webSocketUrls = yield call(anomalyData.getWebSocketUrls);
    yield put(updateWebSocketUrlsSuccess(webSocketUrls));
  } catch (e) {
    yield put(updateWebSocketUrlsFailure(e.message));
  }
}

function appSagaBuilder(apis, apiUrlProvider, authTokenProvider) {
  return function* appSaga() {
    yield takeLatest(CONFIG_REQUEST_INIT, fetchConfig);
    yield takeLatest(CAMERA_FILTERS_UPDATE_INIT, fetchCameraFilters, apis.cameraFilterApi, apiUrlProvider, authTokenProvider);
    yield takeLatest(WEBSOCKET_URLS_UPDATE_INIT, fetchWebSocketUrls, apis.anomalyApi, apiUrlProvider, authTokenProvider);
  };
}

export default appSagaBuilder;
