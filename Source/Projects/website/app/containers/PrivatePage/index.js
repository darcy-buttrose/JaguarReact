/*
 * Teacher
 *
 * This is the first thing teachers see after login
 */

import React from 'react';
import userIsAuthenticated from 'utils/userIsAuthenticated';

export class PrivatePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <h1>This is a private page.</h1>
    );
  }
}

export default userIsAuthenticated(PrivatePage);
