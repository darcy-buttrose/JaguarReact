import React from 'react';
import { Link } from 'react-router-dom';
import LocaleToggle from 'containers/LocaleToggle';
import AuthConnect from 'containers/AuthConnect';
import messages from './messages';
import logo from './icetana-logo.svg';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <header>
        <div className="container">
          <div className="row">
            <div className="twelve columns">
              <div className="header-brand">
                <Link to="/">
                  <img src={logo} alt={messages.logoAlt.defaultMessage} title={messages.logoAlt.defaultMessage} />
                </Link>
              </div>
              <div className="header-right">
                <span className="header-drop">
                  <LocaleToggle />
                </span>
                <span className="header-drop-no-image">
                  <AuthConnect />
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
