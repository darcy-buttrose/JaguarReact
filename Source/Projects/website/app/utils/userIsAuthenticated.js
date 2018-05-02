import { connectedReduxRedirect } from 'redux-auth-wrapper/history4/redirect';
import { routerActions } from 'react-router-redux';

const userIsAuthenticated = connectedReduxRedirect({
   // The url to redirect user to if they fail
  redirectPath: '/noauth',
   // If selector is true, wrapper will not redirect
   // For example let's check that state contains user data
  authenticatedSelector: (state) => state.get('auth').get('isAuthenticated') === true,
  // A nice display name for this check
  wrapperDisplayName: 'UserIsAuthenticated',

  redirectAction: routerActions.replace,
});

export default userIsAuthenticated;
