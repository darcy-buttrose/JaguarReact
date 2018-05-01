/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { Helmet } from 'react-helmet';

export class AboutPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div className="container" >
        <div className="row">
          <div className="twelve columns">
            <main>
              <Helmet>
                <title>About</title>
                <meta name="About" content="The easiest way to find your next teaching job overseas. Search our database of top international schools seeking qualified teachers." />
              </Helmet>
              <div>
                <h1>About</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default AboutPage;
