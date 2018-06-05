import { createSelector } from 'reselect';

/**
 * Direct selector to the config state domain
 */
const selectConfigDomain = (state) => state.get('config');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Config
 */

const makeSelectConfig = () => createSelector(
  selectConfigDomain,
  (substate) => substate ? substate.toJS() : {}
);

export default makeSelectConfig;
export {
  selectConfigDomain,
};
