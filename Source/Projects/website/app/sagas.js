import { fork, select } from 'redux-saga/effects';
import appSagaBuilder from './state/App/saga';
import authSagaBuilder from './state/Auth/saga';
import profileSagaBuilder from './state/Profile/saga';
import cameraFilterApi from './services/CameraFilter/mock';
import profileApi from './services/Profile/mock';
import anomalyApi from './services/Anomaly';
import secureApiGenerator from './services/secureApiGenerator';

function* authUserProvider() {
  const state = yield select();
  const auth = state.get('auth').toJS();
  return auth.user;
}

function* apiUrlProvider() {
  const state = yield select();
  const app = state.get('app').toJS();
  return app.config.clientAppSettings.apiScheme + app.config.clientAppSettings.apiUrl;
}

const secureCameraFilterApi = secureApiGenerator(cameraFilterApi, authUserProvider, apiUrlProvider);
const secureProfileApi = secureApiGenerator(profileApi, authUserProvider, apiUrlProvider);
const secureAnomalyApi = secureApiGenerator(anomalyApi, authUserProvider, apiUrlProvider);

const appSaga = appSagaBuilder({ cameraFilterApi: secureCameraFilterApi, anomalyApi: secureAnomalyApi });
const authSaga = authSagaBuilder({ profileApi: secureProfileApi });
const profileSaga = profileSagaBuilder({ profileApi: secureProfileApi });

export default function* rootSaga() {
  yield [
    fork(appSaga),
    fork(authSaga),
    fork(profileSaga),
  ];
}
