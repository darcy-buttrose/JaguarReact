import { createSelector } from 'reselect';

/**
 * Direct selector to the Route state domain
 */
const selectRouteDomain = (state) => state.get('route');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Route
 */

const makeSelectRoute = () => createSelector(
  selectRouteDomain,
  (substate) => substate.toJS()
);

export default makeSelectRoute;
export {
  selectRouteDomain,
};
