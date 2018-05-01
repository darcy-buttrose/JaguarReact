/*
 *
 * Navbar actions
 *
 */

import {
  NAVBAR_OPEN,
  NAVBAR_CLOSE,
} from './constants';


export function openMenu() {
  return {
    type: NAVBAR_OPEN,
  };
}

export function closeMenu() {
  return {
    type: NAVBAR_CLOSE,
  };
}
