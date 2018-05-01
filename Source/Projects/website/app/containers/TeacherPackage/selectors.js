import { createSelector } from 'reselect';

/**
 * Direct selector to the teacherPackage state domain
 */
const selectTeacherPackageDomain = (state) => state.get('teacherPackage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by TeacherPackage
 */

const makeSelectTeacherPackage = () => createSelector(
  selectTeacherPackageDomain,
  (substate) => substate.toJS()
);

export default makeSelectTeacherPackage;
export {
  selectTeacherPackageDomain,
};
