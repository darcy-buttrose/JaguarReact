/*
 *
 * TeacherPackage reducer
 *
 */

import { fromJS } from 'immutable';
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

const initialState = fromJS({
  SubscriptionId: null,
  firstName: null,
  lastName: null,
  emailAddress: null,
  password: null,
  passwordConfirm: null,
  terms: null,
  showError: false,
  errorMessage: null,
  loadingRegistration: false,
});

function teacherPackageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case TEACHER_SELECT_PACKAGE:
      return state
      .set('SubscriptionId', action.item);
    case UPDATE_TEACHER_PACKAGE_FIRSTNAME:
      return state
      .set('firstName', action.item);
    case UPDATE_TEACHER_PACKAGE_LASTNAME:
      return state
      .set('lastName', action.item);
    case UPDATE_TEACHER_PACKAGE_EMAIL:
      return state
      .set('emailAddress', action.item);
    case UPDATE_TEACHER_PACKAGE_PASSWORD:
      return state
      .set('password', action.item);
    case UPDATE_TEACHER_PACKAGE_PASSWORDCONFIRM:
      return state
      .set('passwordConfirm', action.item);
    case UPDATE_TEACHER_PACKAGE_TERMS:
      return state
      .set('terms', action.item);
    default:
      return state;
  }
}

export default teacherPackageReducer;
