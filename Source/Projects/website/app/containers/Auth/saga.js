import { call, put, select, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import api from '../../services/api';
import { updateProfileSuccess, updateProfileFailure } from './actions';
import { UPDATE_PROFILE_INIT } from './constants';
// import { selectAppDomain } from '../App/selectors';
// import { selectAuthDomain } from './selectors';

function* fetchProfile(action) {
  try {
    const state = yield select();
    const app = state.get('app').toJS();
    const auth = state.get('auth').toJS();
    const apiUrl = app.config.clientAppSettings.apiScheme + app.config.clientAppSettings.apiUrl;
    const idToken = auth.user.id_token;
    const profileApi = api.create(apiUrl, idToken);
    const profile = yield call(profileApi.getProfile);
    yield put(updateProfileSuccess(Object.assign({}, profile, { name: profile.username })));
    let redirect = '/private';
    if (action.options && action.options.redirectToHome) {
      if (profile.role && typeof profile.role === 'object') {
        if (profile.role.includes('admin')) {
          redirect = '/admin';
        }
        if (profile.role.includes('operator')) {
          redirect = '/livewall';
        }
      }
      yield put(push(redirect));
    }
  } catch (e) {
    yield put(updateProfileFailure(e.message));
  }
}

function* authSaga() {
  yield takeLatest(UPDATE_PROFILE_INIT, fetchProfile);
}

export default authSaga;
