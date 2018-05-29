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

  const getProfile = () => new Promise((resolve: Function, reject: Function): void => {
    fetch(`${baseURL}profile`, {
      mode: 'cors',
      method: 'GET',
      credentials: 'include',
      headers: getHeaders(),
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

  const saveProfile = (profile) => new Promise((resolve: Function, reject: Function): void => {
    fetch(`${baseURL}profile`, {
      mode: 'cors',
      method: 'PUT',
      credentials: 'include',
      headers: getHeaders(),
      body: JSON.stringify({
        profile,
      }),
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


  return {
    // a list of the API functions
    getProfile,
    saveProfile,
  };
};

export default {
  create,
};
