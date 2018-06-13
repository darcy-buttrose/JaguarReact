import SagaTester from 'redux-saga-tester';
import appSagaBuilder from '../saga';
import mockCameraFilterApi, { mockData } from '../../../services/CameraFilter/mock';
import { startUpdateCameraFilters } from '../actions';
import { CAMERA_FILTERS_UPDATE_SUCCESS } from '../constants';

function* apiUrlProvider() {
  yield 'blah';
}

function* authTokenProvider() {
  yield 'blah';
}

describe('appSage', () => {
  it('should listen for CAMERA_FILTERS_UPDATE_INIT and return camera filter list', async () => {
    const appSaga = appSagaBuilder(mockCameraFilterApi, apiUrlProvider, authTokenProvider);
    const sagaTester = new SagaTester({});

    sagaTester.start(appSaga);
    sagaTester.dispatch(startUpdateCameraFilters());
    await sagaTester.waitFor(CAMERA_FILTERS_UPDATE_SUCCESS);
    expect(sagaTester.getLatestCalledActions(1)).toEqual([
      {
        type: CAMERA_FILTERS_UPDATE_SUCCESS,
        filters: mockData,
      },
    ]);
  });
});
