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
    name: user.profile.name,
  };
  return Object.assign({}, profile, profiles[profile.name] || { role: ['other'] });
}

// Create a base for API.
const create = (baseURL, user) => {
  const getProfile = () => new Promise((resolve: Function): void => {
    const outProfile = resolveProfile(user);
    resolve(outProfile);
  });

  const saveProfile = (profile) => new Promise((resolve: Function): void => {
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
