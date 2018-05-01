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

  const getCountries = () => api.get('/lookup/getcountries', {}, { headers: getHeaders('token') });
  const getSchoolQuote = (quoteModel) => api.post('/registration/getschoolprice', quoteModel, { headers: getHeaders('token') });
  // const getSomething = (token) => api.get('/lookup/getcountries', {}, { headers: getHeaders(token) });

  return {
      // a list of the API functions
    getCountries,
    getSchoolQuote,
  };
};

export default {
  create,
};
