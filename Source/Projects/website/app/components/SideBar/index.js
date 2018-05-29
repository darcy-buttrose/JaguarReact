import React from 'react';
import { Link } from 'react-router-dom';

function SideBar() {
  return (
    <div className="jaguar-sidebar">
      <Link to="/livewall">
        <span className="fas fa-th fa-2x"></span>
      </Link><br />
      <Link to="/playback">
        <span className="far fa-play-circle fa-2x"></span>
      </Link><br />
      <Link to="/playbackwall">
        <span className="fab fa-youtube fa-2x"></span>
      </Link><br />
      <Link to="/history">
        <span className="fas fa-history fa-2x"></span>
      </Link>
    </div>
  );
}

export default SideBar;
