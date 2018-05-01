/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <main>
        <Helmet>
          <title>Public Page</title>
          <meta name="iCetana" content="" />
        </Helmet>

        <div className="connect-banner">
          <div className="container" >
            <div className="row">
              <div className="twelve columns">
                <div className="banner-heading"><FormattedMessage {...messages.header} /></div>
              </div>
            </div>
          </div>
        </div>

        <div className="second-row">
          <div className="container" >
            <div className="row">
              <div className="four columns">
                <ul>
                  <li><FormattedMessage {...messages.listitem} /></li>
                </ul>
              </div>
              <div className="four columns">
                <ul>
                  <li><FormattedMessage {...messages.listitem} /></li>
                </ul>
              </div>
              <div className="four columns">
                <ul>
                  <li><FormattedMessage {...messages.listitem} /></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </main>
    );
  }
}

export default HomePage;
