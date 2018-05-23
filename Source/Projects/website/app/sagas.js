import { fork } from 'redux-saga/effects';
import appSaga from './containers/App/saga';
import authSaga from './containers/Auth/saga';

export default function* rootSaga() {
  yield [
    fork(appSaga),
    fork(authSaga),
  ];
}
