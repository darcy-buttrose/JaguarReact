import { fork } from 'redux-saga/effects';
import appSaga from './containers/App/saga';
import authSaga from './containers/Auth/saga';
import profileButtonSaga from './containers/ProfileButtonContainer/saga';

export default function* rootSaga() {
  yield [
    fork(appSaga),
    fork(authSaga),
    fork(profileButtonSaga),
  ];
}
