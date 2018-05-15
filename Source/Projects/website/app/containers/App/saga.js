import { call, put, takeLatest } from 'redux-saga/effects';
import { getConfig } from '../../services/config';
import { loadConfigSuccess, loadConfigFailure } from './actions';
import { CONFIG_REQUEST_INIT } from './constants';

function* fetchConfig() {
  try {
    const config = yield call(getConfig);
    yield put(loadConfigSuccess(config));
  } catch (e) {
    yield put(loadConfigFailure(e.message));
  }
}

function* appSaga() {
  yield takeLatest(CONFIG_REQUEST_INIT, fetchConfig);
}

export default appSaga;
