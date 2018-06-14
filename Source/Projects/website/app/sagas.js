import { fork, select } from 'redux-saga/effects';
import appSagaBuilder from './state/App/saga';
import authSagaBuilder from './state/Auth/saga';
import profileSagaBuilder from './state/Profile/saga';
import cameraFilterApi from './services/CameraFilter/mock';
import profileApi from './services/Profile/mock';
import anomalyApi from './services/Anomaly/mock';
import secureApiGenerator from './services/secureApiGenerator';

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

const secureCameraFilterApi = secureApiGenerator(cameraFilterApi, authTokenProvider, apiUrlProvider);
const secureProfileApi = secureApiGenerator(profileApi, authTokenProvider, apiUrlProvider);
const secureAnomalyApi = secureApiGenerator(anomalyApi, authTokenProvider, apiUrlProvider);

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
