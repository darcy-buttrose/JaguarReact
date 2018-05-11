import * as Oidc from 'oidc-client/lib/oidc-client';
import config from 'config/config.json';
import { identityServer, developmentServer } from 'utils/getConfig';

const appConfig = {
  authority: identityServer(),
  client_id: 'jaguar_implicit',
  response_type: 'id_token token',
  scope: 'openid profile email',
  post_logout_redirect_uri: developmentServer(),
  popup_redirect_uri: developmentServer() + 'popupcallback',
  popupWindowFeatures: 'location=no,toolbar=no,width=500,height=500,top=100,left=0,modal=yes,chrome=yes',
};

const mgr = new Oidc.UserManager(appConfig);

export default mgr;
