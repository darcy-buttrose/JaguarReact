/**
 *
 * Asynchronously loads the component for DjangoLoginPage
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
