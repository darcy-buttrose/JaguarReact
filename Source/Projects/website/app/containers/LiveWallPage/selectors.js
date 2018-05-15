import { createSelector } from 'reselect';

/**
 * Direct selector to the livewall state domain
 */
const selectLiveWallDomain = (state) => state.get('livewall');

/**
 * Other specific selectors
 */


/**
 * Default selector used by LiveWall
 */

const makeSelectLiveWall = () => createSelector(
  selectLiveWallDomain,
  (substate) => substate.toJS()
);

export default makeSelectLiveWall;
export {
  selectLiveWallDomain,
};
