import { call, takeLatest } from 'redux-saga/effects';
import { CHANGE_THEME } from './constants';

function* saveTheme(profileApi, action) {
  const { options } = action;
  if (options.save) {
    const profileData = yield profileApi.create();
    yield call(profileData.saveProfile, { theme: action.item });
  }
}

function profileSagaBuilder(apis) {
  return function* profileButtonSaga() {
    yield takeLatest(CHANGE_THEME, saveTheme, apis.profileApi);
  };
}

export default profileSagaBuilder;
