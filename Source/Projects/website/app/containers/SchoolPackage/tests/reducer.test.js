
import { fromJS } from 'immutable';
import schoolPackageReducer from '../reducer';

describe('schoolPackageReducer', () => {
  it('returns the initial state', () => {
    expect(schoolPackageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
