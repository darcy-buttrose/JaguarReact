const express = require('express');
const Provider = require('oidc-provider');
const { createKeyStore } = require('oidc-provider');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const config = require('./config/config');
const clients = require('./clients/clients');
const features = require('./features/features');

const app = express();

const thisUrl = config.authAppSettings.apiScheme + config.authAppSettings.thisUrl;

const oidc = new Provider(thisUrl, features);

const keystore = require('./keys/keystore.json');

oidc.initialize({
  keystore: keystore,
  clients: clients,
}).then(function () {
    app.use('/', oidc.callback);
    app.listen(4000);
});
