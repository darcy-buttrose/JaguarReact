
import { fromJS } from 'immutable';
import teacherPackageReducer from '../reducer';

describe('teacherPackageReducer', () => {
  it('returns the initial state', () => {
    expect(teacherPackageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
