/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectReference = (state) => state.get('global');

const makeSelectCountries = () => createSelector(
  selectReference,
  (referenceState) => referenceState.get('countries')
);

export {
  selectReference,
  makeSelectCountries,
};
