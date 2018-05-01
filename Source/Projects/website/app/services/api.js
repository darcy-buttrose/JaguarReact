import apisauce from 'apisauce';
import appConfig from '../config/config.json';

/*
 * apisauce is supported by reactotron.
 */

// Create a base for API.
const create = (baseURL = appConfig.clientAppSettings.apiScheme + appConfig.clientAppSettings.apiUrl) => {
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // 10 second timeout...
    timeout: 10000,
  });

  const getHeaders = (token) => {
    const headers = {
      'Cache-Control': 'no-cache',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` };
    return headers;
  };

  const getSomething = () => api.get('/api/getSomething', {}, { headers: getHeaders('token') });
  const sendSomething = (somethingModel) => api.post('/api/addSomething', somethingModel, { headers: getHeaders('token') });

  return {
      // a list of the API functions
    getSomething,
    sendSomething,
  };
};

export default {
  create,
};
