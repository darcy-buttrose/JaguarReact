/*
 * Teacher
 *
 * This is the first thing teachers see after login
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import userIsAuthenticated from 'utils/userIsAuthenticated';

export class PrivatePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div className="container" >
        <div className="row">
          <div className="twelve columns">
            <main>
              <Helmet>
                <title>Private Page</title>
                <meta name="Private Page" content="." />
              </Helmet>
              <div>
                <h1>This is a private page.</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default userIsAuthenticated(PrivatePage);
