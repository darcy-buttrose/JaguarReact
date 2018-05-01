/*
 * Teacher
 *
 * This is the first thing teachers see after login
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import userIsAuthenticated from 'utils/userIsAuthenticated';

export class Teacher extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div className="container" >
        <div className="row">
          <div className="twelve columns">
            <main>
              <Helmet>
                <title>Teacher</title>
                <meta name="Teacher" content="The easiest way to find your next teaching job overseas. Search our database of top international schools seeking qualified teachers." />
              </Helmet>
              <div>
                <h1>Teacher</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default userIsAuthenticated(Teacher);
