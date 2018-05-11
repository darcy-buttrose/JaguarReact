import * as Oidc from 'oidc-client/lib/oidc-client';
import { identityServer, appServer } from '../../services/config';

const appConfig = {
  authority: identityServer(),
  client_id: 'jaguar_implicit',
  response_type: 'id_token token',
  scope: 'openid profile email',
  post_logout_redirect_uri: appServer(),
  popup_redirect_uri: `${appServer()}popupcallback`,
  popupWindowFeatures: 'location=no,toolbar=no,width=500,height=500,top=500,left=500,modal=yes,chrome=yes',
};

const mgr = new Oidc.UserManager(appConfig);

export default mgr;
