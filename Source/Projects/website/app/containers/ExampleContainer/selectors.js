import { createSelector } from 'reselect';

/**
 * Direct selector to the exampleContainer state domain
 */
const selectExampleContainerDomain = (state) => state.get('exampleContainer');

/**
 * Other specific selectors
 */


/**
 * Default selector used by ExampleContainer
 */

const makeSelectExampleContainer = () => createSelector(
  selectExampleContainerDomain,
  (substate) => substate.toJS()
);

export default makeSelectExampleContainer;
export {
  selectExampleContainerDomain,
};
