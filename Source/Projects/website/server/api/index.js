import { Router } from 'express';
import { version } from '../../package.json';

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
  const api = Router();

  api.get('/profile', (req, res) => {
    const profile = resolveProfile(req.user);
    console.log('get profile', profile);
    res.send(profile);
  });

  api.put('/profile', (req, res) => {
    const inProfile = req.body.profile;
    const { user } = req;
    console.log('put profile in', inProfile);
    const existingProfile = resolveProfile(user);
    profiles[user.username] = Object.assign({}, existingProfile, inProfile);
    const outProfile = resolveProfile(user);
    console.log('put profile out', outProfile);
    res.send(outProfile);
  });

  // perhaps expose some API metadata at the root
  api.get('/', (req, res) => {
    res.json({ version });
  });

  return api;
};
