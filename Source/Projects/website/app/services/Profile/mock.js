const profiles = {
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

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}

// Create a base for API.
const create = (baseURL, token) => {
  console.log(`Profile Api Mock: baseUrl(${baseURL}) token(${token})`)
  const getUser = () => parseJwt(token);

  const getProfile = () => new Promise((resolve: Function): void => {
    const user = getUser();
    const outProfile = resolveProfile(user);
    resolve(outProfile);
  });

  const saveProfile = (profile) => new Promise((resolve: Function): void => {
    const user = getUser();
    const existingProfile = resolveProfile(user);
    profiles[user.username] = Object.assign({}, existingProfile, profile);
    const outProfile = resolveProfile(user);
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
