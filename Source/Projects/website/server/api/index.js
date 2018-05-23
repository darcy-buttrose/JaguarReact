import { Router } from 'express';
import { version } from '../../package.json';

function resolveProfile(user) {
  const profile = {
    name: user.username,
  };
  switch (user.username) {
    case 'admin': {
      return Object.assign({}, profile, {
        role: ['admin'],
      });
    }
    case 'icetana': {
      return Object.assign({}, profile, {
        role: ['operator'],
        theme: 'night',
      });
    }
    default : {
      return Object.assign({}, profile, {
        role: ['other'],
      });
    }
  }
}

export default () => {
  const api = Router();

  api.get('/profile', (req, res) => {
    const profile = resolveProfile(req.user);
    console.log('profile', profile);
    res.send(profile);
  });

  // perhaps expose some API metadata at the root
  api.get('/', (req, res) => {
    res.json({ version });
  });

  return api;
};
