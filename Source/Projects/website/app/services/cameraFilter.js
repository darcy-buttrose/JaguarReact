import apisauce from 'apisauce';

/*
 * apisauce is supported by reactotron.
 */

const cameraFilter = [
  {
    "id": 0,
    "name": "All Cameras"
  },
  {
    "id": 5,
    "name": "Glitchy"
  },
  {
    "id": 4,
    "name": "internal"
  },
  {
    "id": 1,
    "name": "milestone-all"
  },
  {
    "id": 2,
    "name": "milestone-pta"
  },
  {
    "id": 3,
    "name": "milestone-swinburne"
  }
];

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
    resolve(cameraFilter);
  });


  return {
    // a list of the API functions
    getCameraFilter,
  };
};

export default {
  create,
};
