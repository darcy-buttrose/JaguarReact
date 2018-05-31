import React from 'react';
import { Helmet } from 'react-helmet';
import userIsAuthenticated from 'utils/userIsAuthenticated';

export class AdminPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div className="container" >
        <div className="row">
          <div className="twelve columns">
            <main>
              <Helmet>
                <title>Admin Page</title>
                <meta name="Admin Page" content="." />
              </Helmet>
              <div>
                <h1>This is your admin page.</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default userIsAuthenticated(AdminPage);
