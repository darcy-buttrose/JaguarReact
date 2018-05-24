import { call, put, select, takeLatest } from 'redux-saga/effects';
import api from '../../services/api';
import { CHANGE_THEME } from './constants';

function* saveTheme(action) {
  const {options} = action;
  const state = yield select();
  const app = state.get('app').toJS();
  const auth = state.get('auth').toJS();
  const apiUrl = app.config.clientAppSettings.apiScheme + app.config.clientAppSettings.apiUrl;
  const idToken = auth.user.id_token;
  const profileApi = api.create(apiUrl, idToken);
  if (options.save) {
    yield call(profileApi.saveProfile, {theme: action.item});
  }
}

function* profileButtonSaga() {
  yield takeLatest(CHANGE_THEME, saveTheme);
}

export default profileButtonSaga;
