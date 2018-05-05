import config from 'config/config.json';

export const identityServer = () => {
  let server = '';
  switch(process.env.NODE_ENV) {
    case 'production':
      server = config.Production.clientAppSettings.apiScheme + config.Production.clientAppSettings.identityUrl;
      break;
    case 'development':
    server = config.Development.clientAppSettings.apiScheme + config.Development.clientAppSettings.identityUrl;
      break;
    case 'buildserver':
      server = config.BuildServer.clientAppSettings.apiScheme + config.BuildServer.clientAppSettings.identityUrl;
      break;
    default:
      server = config.Development.clientAppSettings.apiScheme + config.Development.clientAppSettings.identityUrl;
      break;
  }
  return server;
}

export const developmentServer = () => {
  let server = '';
  switch(process.env.NODE_ENV) {
    case 'production':
      server = config.Production.clientAppSettings.apiScheme + config.Production.clientAppSettings.thisUrl;
      break;
    case 'development':
    server = config.Development.clientAppSettings.apiScheme + config.Development.clientAppSettings.thisUrl;
      break;
    case 'buildserver':
      server = config.BuildServer.clientAppSettings.apiScheme + config.BuildServer.clientAppSettings.thisUrl;
      break;
    default:
      server = config.Development.clientAppSettings.apiScheme + config.Development.clientAppSettings.thisUrl;
      break;
  }
  return server;
}

export const apiServer = () => {
  let server = '';
  switch(process.env.NODE_ENV) {
    case 'production':
      server = config.Production.clientAppSettings.apiScheme + config.Production.clientAppSettings.apiUrl;
      break;
    case 'development':
    server = config.Development.clientAppSettings.apiScheme + config.Development.clientAppSettings.apiUrl;
      break;
    case 'buildserver':
      server = config.BuildServer.clientAppSettings.apiScheme + config.BuildServer.clientAppSettings.apiUrl;
      break;
    default:
      server = config.Development.clientAppSettings.apiScheme + config.Development.clientAppSettings.apiUrl;
      break;
  }
  return server;
}
