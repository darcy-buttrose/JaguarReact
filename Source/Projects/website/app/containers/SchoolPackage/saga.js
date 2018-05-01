import { delay } from 'redux-saga';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import API from 'services/api';
import makeSelectSchoolPackage from 'containers/SchoolPackage/selectors';
import { COUNTRIES_REQUEST_INIT } from 'containers/App/constants';
import { getCountries } from 'containers/App/saga';
import { SCHOOL_PACKAGE_QUOTE_INIT } from './constants';
import { quoteSuccess, quoteFailure } from './actions';
import messages from './messages';


const api = API.create();

export function* getQuote() {
  const schoolState = yield select(makeSelectSchoolPackage());
  const SchoolRegistrationQuoteModel = {};
  console.log(schoolState); // eslint-disable-line no-console
  // build the request object
  SchoolRegistrationQuoteModel.SubscriptionId = schoolState.SubscriptionId;
  SchoolRegistrationQuoteModel.CountryId = schoolState.CountryId;
  SchoolRegistrationQuoteModel.StudentPopulation = schoolState.StudentPopulation;
  SchoolRegistrationQuoteModel.AnnualTuitionFee = schoolState.AnnualTuitionFee;
  SchoolRegistrationQuoteModel.MonthlyJobListings = schoolState.MonthlyJobListings;
  SchoolRegistrationQuoteModel.HasAdvancedCurriculum = schoolState.HasAdvancedCurriculum;

  for (let i = 0; i < 5; i += 1) {
    try {
      const response = yield call(api.getSchoolQuote, SchoolRegistrationQuoteModel);
      if (response.ok) {
        if (response.data.length > 0) {
          yield put(quoteSuccess(response.data));
        } else {
          yield put(quoteFailure(messages.nodata.defaultMessage));
        }
      } else {
        yield put(quoteFailure(messages.failed.defaultMessage));
      }
    } catch (e) {
      if (i < 4) {
        yield call(delay, 1500);
      } else {
        yield put(quoteFailure(e.message));
      }
    }
  }
}

// Individual exports for testing
export default function* quoteSaga() {
  yield takeLatest(SCHOOL_PACKAGE_QUOTE_INIT, getQuote);
  yield takeLatest(COUNTRIES_REQUEST_INIT, getCountries);
}
