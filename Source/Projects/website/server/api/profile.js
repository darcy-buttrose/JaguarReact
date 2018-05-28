import { Router } from 'express';

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

export default () => {
  const profile = Router();

  profile.get('/', (req, res) => {
    const outProfile = resolveProfile(req.user);
    console.log('get profile out', outProfile);
    res.send(outProfile);
  });

  profile.put('/', (req, res) => {
    const inProfile = req.body.profile;
    const { user } = req;
    console.log('put profile in', inProfile);
    const existingProfile = resolveProfile(user);
    profiles[user.username] = Object.assign({}, existingProfile, inProfile);
    const outProfile = resolveProfile(user);
    console.log('put profile out', outProfile);
    res.send(outProfile);
  });

  return profile;
};
