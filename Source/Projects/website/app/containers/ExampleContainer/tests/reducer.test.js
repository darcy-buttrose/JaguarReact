
import { fromJS } from 'immutable';
import exampleContainerReducer from '../reducer';

describe('exampleContainerReducer', () => {
  it('returns the initial state', () => {
    expect(exampleContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
