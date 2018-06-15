import SagaTester from 'redux-saga-tester';
import appSagaBuilder from '../saga';
import cameraFilterApi, { mockData as mockCameraFilterData } from '../../../services/CameraFilter/mock';
import anomalyApi, { mockData as mockWebSocketUrlData } from '../../../services/Anomaly/mock';
import {
  startUpdateCameraFilters,
  startUpdateWebSocketUrls,
} from '../actions';
import {
  CAMERA_FILTERS_UPDATE_SUCCESS,
  WEBSOCKET_URLS_UPDATE_SUCCESS,
} from '../constants';

describe('appSage', () => {
  it('should listen for CAMERA_FILTERS_UPDATE_INIT and return camera filter list', async () => {
    const appSaga = appSagaBuilder({ cameraFilterApi, anomalyApi });
    const sagaTester = new SagaTester({});

    sagaTester.start(appSaga);
    sagaTester.dispatch(startUpdateCameraFilters());
    await sagaTester.waitFor(CAMERA_FILTERS_UPDATE_SUCCESS);
    expect(sagaTester.getLatestCalledActions(1)).toEqual([
      {
        type: CAMERA_FILTERS_UPDATE_SUCCESS,
        filters: mockCameraFilterData,
      },
    ]);
  });

  it('should listen for WEBSOCKET_URLS_UPDATE_INIT and return webSocket url list', async () => {
    const appSaga = appSagaBuilder({ cameraFilterApi, anomalyApi });
    const sagaTester = new SagaTester({});

    sagaTester.start(appSaga);
    sagaTester.dispatch(startUpdateWebSocketUrls());
    await sagaTester.waitFor(WEBSOCKET_URLS_UPDATE_SUCCESS);
    expect(sagaTester.getLatestCalledActions(1)).toEqual([
      {
        type: WEBSOCKET_URLS_UPDATE_SUCCESS,
        urls: mockWebSocketUrlData,
      },
    ]);
  });
});
