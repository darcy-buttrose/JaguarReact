import { createSelector } from 'reselect';

/**
 * Direct selector to the callbackPage state domain
 */
const selectCallbackPageDomain = (state) => state.get('auth');

/**
 * Other specific selectors
 */


/**
 * Default selector used by CallbackPage
 */

const makeSelectCallbackPage = () => createSelector(
  selectCallbackPageDomain,
  (substate) => substate.toJS()
);

export default makeSelectCallbackPage;
export {
  selectCallbackPageDomain,
};
