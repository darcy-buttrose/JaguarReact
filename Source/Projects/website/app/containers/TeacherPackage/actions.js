/*
 *
 * TeacherPackage actions
 *
 */

import {
 DEFAULT_ACTION,
 TEACHER_SELECT_PACKAGE,
 UPDATE_TEACHER_PACKAGE_FIRSTNAME,
 UPDATE_TEACHER_PACKAGE_LASTNAME,
 UPDATE_TEACHER_PACKAGE_EMAIL,
 UPDATE_TEACHER_PACKAGE_PASSWORD,
 UPDATE_TEACHER_PACKAGE_PASSWORDCONFIRM,
 UPDATE_TEACHER_PACKAGE_TERMS,
} from './constants';

/**
 * [defaultAction description]
 * @return {[type]} [description]
 */
export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

/**
 * [selectTeacherPackage description]
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
export function selectTeacherPackage(item) {
  return {
    type: TEACHER_SELECT_PACKAGE,
    item,
  };
}

/**
 * [updateTeacherPackageFirstName description]
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
export function updateTeacherPackageFirstName(item) {
  return {
    type: UPDATE_TEACHER_PACKAGE_FIRSTNAME,
    item,
  };
}

/**
 * [updateTeacherPackageLastName description]
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
export function updateTeacherPackageLastName(item) {
  return {
    type: UPDATE_TEACHER_PACKAGE_LASTNAME,
    item,
  };
}

/**
 * [updateTeacherPackageEmail description]
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
export function updateTeacherPackageEmail(item) {
  return {
    type: UPDATE_TEACHER_PACKAGE_EMAIL,
    item,
  };
}

/**
 * [updateTeacherPackagePassword description]
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
export function updateTeacherPackagePassword(item) {
  return {
    type: UPDATE_TEACHER_PACKAGE_PASSWORD,
    item,
  };
}

/**
 * [updateTeacherPackagePasswordConfirm description]
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
export function updateTeacherPackagePasswordConfirm(item) {
  return {
    type: UPDATE_TEACHER_PACKAGE_PASSWORDCONFIRM,
    item,
  };
}

/**
 * [updateTeacherPackageTerms description]
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
export function updateTeacherPackageTerms(item) {
  return {
    type: UPDATE_TEACHER_PACKAGE_TERMS,
    item,
  };
}
