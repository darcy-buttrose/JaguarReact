import React from 'react';
import { NavLink } from 'react-router-dom';

function NavOperator() {
  return (
    <div className="sidebar-menu">
      <ul>
        <li>
          <NavLink to="/livewall" activeClassName="sidebar-link-active">
            <span className="fas fa-th fa-2x"></span>
            <p>LiveWall</p>
          </NavLink>
        </li>
        <li>
          <NavLink to="/playback">
            <span className="far fa-play-circle fa-2x"></span>
            <p>PlayBack</p>
          </NavLink>
        </li>
        <li>
          <NavLink to="/playbackwall">
            <span className="fab fa-youtube fa-2x"></span>
            <p>PlayBack Wall</p>
          </NavLink>
        </li>
        <li>
          <NavLink to="/history">
            <span className="fas fa-history fa-2x"></span>
            <p>History</p>
          </NavLink>
        </li>
        <li>
          <NavLink to="/livewall">
            <span className="fas fa-cogs fa-2x"></span>
            <p>Config</p>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default NavOperator;
