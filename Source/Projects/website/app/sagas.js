import { fork } from 'redux-saga/effects';
import appSaga from './state/App/saga';
import authSaga from './state/Auth/saga';
import profileSaga from './state/Profile/saga';

export default function* rootSaga() {
  yield [
    fork(appSaga),
    fork(authSaga),
    fork(profileSaga),
  ];
}
