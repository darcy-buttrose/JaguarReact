const config = require('../config/config');

const clients = [{
    client_id: 'jaguar_implicit',
    redirect_uris: [config.authAppSettings.apiScheme + config.authAppSettings.websiteUrl + '/popupcallback'],
    token_endpoint_auth_method: 'none'
}];

module.exports = clients;
