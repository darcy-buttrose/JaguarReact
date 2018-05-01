/**
*
* Navbar
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

function Navbar(props) {
  const cross = props.isOpen ? 'hamburger hamburger--collapse is-active' : 'hamburger hamburger--collapse';
  const menu = props.isOpen ? 'nav-list' : 'nav-list connect-hiddenMobileOnly';
  return (
    <nav>
      <div className="nav-mobile">
        <span id="nav-toggle" onClick={props.onToggleMenu} role="button" tabIndex="-1">
          <div className={cross}>
            <div className="hamburger-box">
              <div className="hamburger-inner"></div>
            </div>
          </div>
        </span>
        <ul className={menu}>
          <li><span onClick={props.onCloseMenu} role="button" tabIndex="-2"><NavLink to="/schoolpackage"><FormattedMessage {...messages.forSchools} /></NavLink></span></li>
          <li><span onClick={props.onCloseMenu} role="button" tabIndex="-2"><NavLink to="/teacherpackage"><FormattedMessage {...messages.forTeachers} /></NavLink></span></li>
          <li><span onClick={props.onCloseMenu} role="button" tabIndex="-2"><NavLink to="/features"><FormattedMessage {...messages.featuredSchools} /></NavLink></span></li>
          <div className="connect-menu-overlay" onClick={props.onToggleMenu} role="button" tabIndex="0"></div>
        </ul>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  onToggleMenu: PropTypes.func,
  onCloseMenu: PropTypes.func,
  isOpen: PropTypes.bool,
};

export default Navbar;
