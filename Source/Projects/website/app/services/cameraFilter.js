import apisauce from 'apisauce';

/*
 * apisauce is supported by reactotron.
 */

// Create a base for API.
const create = (baseURL, token) => {
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // 10 second timeout...
    timeout: 10000,
  });

  const getHeaders = () => {
    const headers = {
      'Cache-Control': 'no-cache',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` };
    return headers;
  };

  const getCameraFilter = () => new Promise((resolve: Function, reject: Function): void => {
    api.get('camera_views/list/', {}, { headers: getHeaders() })
      .then((response) => {
        if (response.status === 200) {
          let cameraFilters = response.data.results || [];
          cameraFilters = [{ id: 0, name: 'No Filter' }, ...cameraFilters];
          resolve(cameraFilters);
        } else {
          reject('get cameraFilter failed');
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

  return {
    // a list of the API functions
    getCameraFilter,
  };
};

export default {
  create,
};
