import * as Oidc from 'oidc-client/lib/oidc-client';
import config from 'config/config.json';

const appConfig = {
  authority: config.clientAppSettings.apiScheme + config.clientAppSettings.identityUrl,
  client_id: 'connect_implicit',
  response_type: 'id_token token',
  scope: 'openid profile email',
  post_logout_redirect_uri: config.clientAppSettings.apiScheme + config.clientAppSettings.thisUrl,
  popup_redirect_uri: `${config.clientAppSettings.apiScheme + config.clientAppSettings.thisUrl}popupcallback`,
  popupWindowFeatures: 'location=no,toolbar=no,width=500,height=500,top=500,left=500,modal=yes,chrome=yes',
};

const mgr = new Oidc.UserManager(appConfig);

export default mgr;
