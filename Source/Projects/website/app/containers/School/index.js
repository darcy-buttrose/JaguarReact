/*
 * School
 *
 * This is the first thing schools see after login
 */

import React from 'react';
import { Helmet } from 'react-helmet';

export class School extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div className="container" >
        <div className="row">
          <div className="twelve columns">
            <main>
              <Helmet>
                <title>School</title>
                <meta name="School" content="The easiest way to find your next teaching job overseas. Search our database of top international schools seeking qualified teachers." />
              </Helmet>
              <div>
                <h1>School</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default School;
