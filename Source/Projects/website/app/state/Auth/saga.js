import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { updateProfileSuccess, updateProfileFailure, startUpdateProfile } from './actions';
import { changeTheme } from '../Profile/actions';
import {
  UPDATE_PROFILE_INIT,
  LOGIN_REQUEST_SUCCESS,
} from './constants';
import { startUpdateCameraFilters, startUpdateWebSocketUrls } from '../App/actions';

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

function* fetchProfile(profileApi, action) {
  try {
    const { options } = action;
    const profileData = yield profileApi.create();
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

function* performLoginSuccessSideAffects() {
  yield put(startUpdateProfile({ redirectToHome: true, updateTheme: true }));
  yield put(startUpdateCameraFilters());
  yield put(startUpdateWebSocketUrls());
}

function authSagaBuilder(apis) {
  return function* authSaga() {
    yield takeLatest(UPDATE_PROFILE_INIT, fetchProfile, apis.profileApi);
    yield takeLatest(LOGIN_REQUEST_SUCCESS, performLoginSuccessSideAffects);
  };
}

export default authSagaBuilder;
