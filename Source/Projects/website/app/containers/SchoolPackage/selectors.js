import { createSelector } from 'reselect';

/**
 * Direct selector to the schoolPackage state domain
 */
const selectSchoolPackageDomain = (state) => state.get('schoolPackage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by SchoolPackage
 */

const makeSelectSchoolPackage = () => createSelector(
  selectSchoolPackageDomain,
  (substate) => substate.toJS()
);

export default makeSelectSchoolPackage;
export {
  selectSchoolPackageDomain,
};
