import { fork, select } from 'redux-saga/effects';
import appSagaBuilder from './state/App/saga';
import authSagaBuilder from './state/Auth/saga';
import profileSagaBuilder from './state/Profile/saga';
import cameraFilterApi from './services/CameraFilter/mock';
import profileApi from './services/Profile/mock';

function* authTokenProvider() {
  const state = yield select();
  const auth = state.get('auth').toJS();
  return auth.user.id_token;
}

function* apiUrlProvider() {
  const state = yield select();
  const app = state.get('app').toJS();
  return app.config.clientAppSettings.apiScheme + app.config.clientAppSettings.apiUrl;
}

const appSaga = appSagaBuilder({ cameraFilterApi }, apiUrlProvider, authTokenProvider);
const authSaga = authSagaBuilder(profileApi, apiUrlProvider, authTokenProvider);
const profileSaga = profileSagaBuilder(profileApi, apiUrlProvider, authTokenProvider);

export default function* rootSaga() {
  yield [
    fork(appSaga),
    fork(authSaga),
    fork(profileSaga),
  ];
}
