import { call, takeLatest } from 'redux-saga/effects';
import { CHANGE_THEME } from './constants';

function* saveTheme(profileApi, apiUrlProvider, authTokenProvider, action) {
  const { options } = action;
  const apiUrl = yield apiUrlProvider();
  const idToken = yield authTokenProvider();
  const profileData = profileApi.create(apiUrl, idToken);
  if (options.save) {
    yield call(profileData.saveProfile, { theme: action.item });
  }
}

function profileSagaBuilder(profileApi, apiUrlProvider, authTokenProvider) {
  return function* profileButtonSaga() {
    yield takeLatest(CHANGE_THEME, saveTheme, profileApi, apiUrlProvider, authTokenProvider);
  };
}

export default profileSagaBuilder;
