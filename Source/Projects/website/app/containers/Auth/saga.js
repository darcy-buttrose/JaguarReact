import { call, put, select, takeLatest } from 'redux-saga/effects';
import api from '../../services/api';
import { updateProfileSuccess, updateProfileFailure } from './actions';
import { UPDATE_PROFILE_INIT } from './constants';
// import { selectAppDomain } from '../App/selectors';
// import { selectAuthDomain } from './selectors';

function* fetchProfile() {
  try {
    const state = yield select();
    const app = state.get('app').toJS();
    const auth = state.get('auth').toJS();
    const apiUrl = app.config.clientAppSettings.apiScheme + app.config.clientAppSettings.apiUrl;
    const idToken = auth.user.id_token;
    const profileApi = api.create(apiUrl, idToken);
    const profile = yield call(profileApi.getProfile);
    yield put(updateProfileSuccess(profile));
  } catch (e) {
    yield put(updateProfileFailure(e.message));
  }
}

function* authSaga() {
  yield takeLatest(UPDATE_PROFILE_INIT, fetchProfile);
}

export default authSaga;
