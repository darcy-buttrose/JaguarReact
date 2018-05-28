/*
 *
 * Profile actions
 *
 */

import {
  CHANGE_THEME,
} from './constants';

export function changeTheme(item, options = { save: true }) {
  return {
    type: CHANGE_THEME,
    item,
    options,
  };
}
