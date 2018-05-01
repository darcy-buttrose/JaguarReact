/*
 *
 * SchoolPackage actions
 *
 */

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

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

/**
 * [selectSchoolPackage description]
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
export function selectSchoolPackage(item) {
  return {
    type: SCHOOL_SELECT_PACKAGE,
    item,
  };
}

/**
 * [updateSchoolPackage description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function updateSchoolPackage(data) {
  return {
    type: UPDATE_SCHOOL_PACKAGE,
    data,
  };
}

/**
 * [updateSchoolPackageCountry description]
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
export function updateSchoolPackageCountry(item) {
  return {
    type: UPDATE_SCHOOL_PACKAGE_COUNTRY,
    item,
  };
}

/**
 * [updateSchoolPackageStudents description]
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
export function updateSchoolPackageStudents(item) {
  return {
    type: UPDATE_SCHOOL_PACKAGE_NUMBERSTUDENTS,
    item,
  };
}

/**
 * [updateSchoolPackageTuition description]
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
export function updateSchoolPackageTuition(item) {
  return {
    type: UPDATE_SCHOOL_PACKAGE_TUITIONFEES,
    item,
  };
}

/**
 * [updateSchoolPackageJobs description]
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
export function updateSchoolPackageJobs(item) {
  return {
    type: UPDATE_SCHOOL_PACKAGE_JOBLISTING,
    item,
  };
}

/**
 * [updateSchoolPackageIBDP description]
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
export function updateSchoolPackageIBDP(item) {
  return {
    type: UPDATE_SCHOOL_PACKAGE_IBDP,
    item,
  };
}

export function quoteStart() {
  return {
    type: SCHOOL_PACKAGE_QUOTE_INIT,
  };
}

export function quoteSuccess(data) {
  return {
    type: SCHOOL_PACKAGE_QUOTE_SUCCESS,
    data,
  };
}

export function quoteFailure(error) {
  return {
    type: SCHOOL_PACKAGE_QUOTE_FAILURE,
    error,
  };
}
