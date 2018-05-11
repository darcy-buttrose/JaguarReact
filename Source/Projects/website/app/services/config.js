export function getConfig() {
  return new Promise((resolve: Function, reject: Function): void => {
    fetch('/config', {
      mode: 'cors',
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.status !== 200) {
          reject(new Error('appConfig fetch failed'));
        }
        return response.json();
      })
      .then(resolve)
      .catch(reject);
  });
}

export const identityServer = async () => {
  const config = await getConfig();
  return config.clientAppSettings.apiScheme + config.clientAppSettings.identityUrl;
};

export const appServer = async () => {
  const config = await getConfig();
  return config.clientAppSettings.apiScheme + config.clientAppSettings.thisUrl;
};

export const apiServer = async () => {
  const config = await getConfig();
  return config.clientAppSettings.apiScheme + config.clientAppSettings.apiUrl;
};
