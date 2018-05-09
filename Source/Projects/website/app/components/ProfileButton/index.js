import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import messages from './messages';

function ProfileButton(props) {
  return (
    <span className="app-profile">
      <span
        className="fas fa-user-circle fa-2x"
        role="presentation"
      ></span>
      <ul className="app-profile-menu">
        <li>{props.username}</li>
        <hr />
        <li
          onClick={props.onLogout}
          role="presentation"
        ><FormattedMessage {...messages.logoff} /></li>
        <hr />
        <li
          className={(props.currentTheme === 'daylight') ? 'app-profile-menu-selected' : 'app-profile-menu-item'}
          onClick={() => { props.onChangeTheme('daylight'); }}
          role="presentation"
        ><FormattedMessage {...messages.daylight} /></li>
        <li
          className={(props.currentTheme === 'night') ? 'app-profile-menu-selected' : 'app-profile-menu-item'}
          onClick={() => { props.onChangeTheme('night'); }}
          role="presentation"
        ><FormattedMessage {...messages.night} /></li>
      </ul>
    </span>
  );
}

ProfileButton.propTypes = {
  onLogout: PropTypes.func,
  onChangeTheme: PropTypes.func,
  username: PropTypes.string,
  currentTheme: PropTypes.string,
};

export default ProfileButton;
