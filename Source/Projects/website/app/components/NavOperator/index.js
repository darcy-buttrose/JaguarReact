import React from 'react';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

function NavOperator() {
  return (
    <div className="sidebar-menu">
      <ul>
        <NavLink to="/livewall" activeClassName="sidebar-link-active">
          <span className="fas fa-th fa-2x"></span>
          <FormattedMessage {...messages.liveWall} />
        </NavLink>
        <NavLink to="/playback">
          <span className="far fa-play-circle fa-2x"></span>
          <FormattedMessage {...messages.playback} />
        </NavLink>
        <NavLink to="/playbackwall">
          <span className="fab fa-youtube fa-2x"></span>
          <FormattedMessage {...messages.playbackWall} />
        </NavLink>
        <NavLink to="/history">
          <span className="fas fa-history fa-2x"></span>
          <FormattedMessage {...messages.history} />
        </NavLink>
        <NavLink to="/private">
          <span className="fas fa-cogs fa-2x"></span>
          <FormattedMessage {...messages.config} />
        </NavLink>
      </ul>
    </div>
  );
}

export default NavOperator;
