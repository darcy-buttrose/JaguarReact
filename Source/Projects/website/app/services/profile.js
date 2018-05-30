import apisauce from 'apisauce';

/*
 * apisauce is supported by reactotron.
 */

let profiles = {
  admin: {
    role: ['admin'],
  },
  icetana: {
    role: ['operator'],
  },
};

function resolveProfile(user) {
  const profile = {
    name: user.username,
  };
  return Object.assign({}, profile, profiles[profile.name] || { role: ['other'] });
}

function parseJwt (token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
};

// Create a base for API.
const create = (baseURL, token) => {
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // 10 second timeout...
    timeout: 10000,
  });

  const getUser = () => {
    return parseJwt(token);
  };

  const getHeaders = () => {
    const headers = {
      'Cache-Control': 'no-cache',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` };
    return headers;
  };

  const getProfile = () => new Promise((resolve: Function, reject: Function): void => {
    const user = getUser();
    const outProfile = resolveProfile(user);
    console.log('get profile out', outProfile);
    resolve(outProfile);
  });

  const saveProfile = (profile) => new Promise((resolve: Function, reject: Function): void => {
    const user = getUser();
    const existingProfile = resolveProfile(user);
    profiles[user.username] = Object.assign({}, existingProfile, profile);
    const outProfile = resolveProfile(user);
    console.log('put profile out', outProfile);
    resolve(outProfile);
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
