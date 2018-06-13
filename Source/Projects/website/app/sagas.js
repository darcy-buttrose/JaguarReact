import { fork } from 'redux-saga/effects';
import appSagaBuilder from './state/App/saga';
import authSaga from './state/Auth/saga';
import profileSaga from './state/Profile/saga';
import cameraFilterApi from './services/CameraFilter';

const appSaga = appSagaBuilder(cameraFilterApi);

export default function* rootSaga() {
  yield [
    fork(appSaga),
    fork(authSaga),
    fork(profileSaga),
  ];
}
