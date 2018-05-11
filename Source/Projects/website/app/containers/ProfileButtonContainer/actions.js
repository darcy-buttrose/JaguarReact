/*
 *
 * Profile actions
 *
 */

import {
  CHANGE_THEME,
} from './constants';

/**
 * [changeTheme description]
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
export function changeTheme(item) {
  return {
    type: CHANGE_THEME,
    item,
  };
}
