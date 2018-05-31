import { call, put, select, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import profileApi from '../../services/profile';

import { updateProfileSuccess, updateProfileFailure } from './actions';
import { updateCameraFiltersSuccess, updateCameraFiltersFailure } from '../App/actions';
import { changeTheme } from '../Profile/actions';
import { UPDATE_PROFILE_INIT } from './constants';
// import { selectAppDomain } from '../App/selectors';
// import { selectAuthDomain } from './selectors';

function* redirectToHome(profile) {
  let redirect = '/private';
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

function* updateTheme(profile) {
  if (profile.theme) {
    yield put(changeTheme(profile.theme, { save: false }));
  } else {
    yield put(changeTheme('daylight', { save: false }));
  }
}

function* fetchProfile(action) {
  try {
    const { options } = action;
    const state = yield select();
    const app = state.get('app').toJS();
    const auth = state.get('auth').toJS();
    const apiUrl = app.config.clientAppSettings.apiScheme + app.config.clientAppSettings.apiUrl;
    const idToken = auth.user.id_token;
    const profileData = profileApi.create(apiUrl, idToken);
    const profile = yield call(profileData.getProfile);
    yield put(updateProfileSuccess(Object.assign({}, profile, { name: profile.username })));
    if (options && options.redirectToHome) {
      yield redirectToHome(profile);
    }
    if (options && options.updateTheme) {
      yield updateTheme(profile);
    }
  } catch (e) {
    yield put(updateProfileFailure(e.message));
  }
}


function* authSaga() {
  yield takeLatest(UPDATE_PROFILE_INIT, fetchProfile);
}



export default authSaga;
