/**
 * Gets the countries list from api
 */
import { delay } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import API from 'services/api';
import { COUNTRIES_REQUEST_INIT } from './constants';
import { countriesSuccess, countriesFailure } from './actions';
import messages from './messages';

const api = API.create();
/**
 * get countries handler
 */
export function* getCountries() {
  for (let i = 0; i < 5; i += 1) {
    try {
      const response = yield call(api.getCountries);
      if (response.ok) {
        if (response.data.length > 0) {
          yield put(countriesSuccess(response.data));
          return response.data;
        } else { // eslint-disable-line no-else-return
          yield put(countriesFailure(messages.nodata.defaultMessage));
        }
      } else {
        yield put(countriesFailure(messages.failed.defaultMessage));
      }
    } catch (e) {
      if (i < 4) {
        yield call(delay, 1500);
      } else {
        yield put(countriesFailure(e.message));
      }
    }
  }
  return null;
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* countriesData() {
  yield takeLatest(COUNTRIES_REQUEST_INIT, getCountries);
}
