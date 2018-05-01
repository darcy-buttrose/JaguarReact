import { createSelector } from 'reselect';

/**
 * Direct selector to the navbar state domain
 */
const selectNavbarDomain = (state) => state.get('navbar');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Navbar
 */

const makeSelectNavbar = () => createSelector(
  selectNavbarDomain,
  (substate) => substate.toJS()
);

export default makeSelectNavbar;
export {
  selectNavbarDomain,
};
