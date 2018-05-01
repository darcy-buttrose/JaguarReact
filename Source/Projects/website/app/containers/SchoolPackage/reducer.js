/*
 *
 * SchoolPackage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  SCHOOL_SELECT_PACKAGE,
  UPDATE_SCHOOL_PACKAGE,
  UPDATE_SCHOOL_PACKAGE_COUNTRY,
  UPDATE_SCHOOL_PACKAGE_NUMBERSTUDENTS,
  UPDATE_SCHOOL_PACKAGE_TUITIONFEES,
  UPDATE_SCHOOL_PACKAGE_JOBLISTING,
  UPDATE_SCHOOL_PACKAGE_IBDP,
  SCHOOL_PACKAGE_QUOTE_INIT,
  SCHOOL_PACKAGE_QUOTE_SUCCESS,
  SCHOOL_PACKAGE_QUOTE_FAILURE,
} from './constants';

const initialState = fromJS({
  SubscriptionId: null,
  CountryId: null,
  StudentPopulation: null,
  AnnualTuitionFee: null,
  MonthlyJobListings: null,
  HasAdvancedCurriculum: null,
  quotePrice: null,
  showError: false,
  errorMessage: null,
  loadingQuote: null,
});

function schoolPackageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SCHOOL_SELECT_PACKAGE:
      return state
      .set('SubscriptionId', action.item)
      .set('quotePrice', null);
    case UPDATE_SCHOOL_PACKAGE:
      return state
      .set('CountryId', action.data.country)
      .set('StudentPopulation', action.data.StudentPopulation)
      .set('AnnualTuitionFee', action.data.AnnualTuitionFee)
      .set('MonthlyJobListings', action.data.MonthlyJobListings)
      .set('HasAdvancedCurriculum', action.data.HasAdvancedCurriculum);
    case UPDATE_SCHOOL_PACKAGE_COUNTRY:
      return state
      .set('CountryId', action.item);
    case UPDATE_SCHOOL_PACKAGE_NUMBERSTUDENTS:
      return state
      .set('StudentPopulation', action.item);
    case UPDATE_SCHOOL_PACKAGE_TUITIONFEES:
      return state
      .set('AnnualTuitionFee', action.item);
    case UPDATE_SCHOOL_PACKAGE_JOBLISTING:
      return state
      .set('MonthlyJobListings', action.item);
    case UPDATE_SCHOOL_PACKAGE_IBDP:
      return state
      .set('HasAdvancedCurriculum', action.item);
    case SCHOOL_PACKAGE_QUOTE_INIT:
      return state
      .set('loadingQuote', true)
      .set('showError', false);
    case SCHOOL_PACKAGE_QUOTE_SUCCESS:
      return state
      .set('loadingQuote', false)
      .set('showError', false)
      .set('quotePrice', action.data);
    case SCHOOL_PACKAGE_QUOTE_FAILURE:
      return state
      .set('loadingQuote', false)
      .set('showError', true);
    default:
      return state;
  }
}

export default schoolPackageReducer;
