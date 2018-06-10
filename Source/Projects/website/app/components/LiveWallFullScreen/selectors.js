import { createSelector } from 'reselect';

/**
 * Direct selector to the LiveWallFullScreen
 */
const selectLiveWallFullScreen = (state) => state.get('liveWallFullScreen');


/**
 * Default selector used by LiveWallFullScreen
 */

const makeSelectLiveWallFullScreen = () => createSelector(
  selectLiveWallFullScreen,
  (substate) => substate, //.toJS()
);

export default makeSelectLiveWallFullScreen;
export {
  selectLiveWallFullScreen,
};
