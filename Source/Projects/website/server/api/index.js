import { Router } from 'express';
import { version } from '../../package.json';
import profile from './profile';
import cameraFilter from './camerafilter';



export default (options) => {
  const api = Router();

  api.use('/profile', profile(options));
  api.use('/cameraFilter', cameraFilter(options));

  // perhaps expose some API metadata at the root
  api.get('/', (req, res) => {
    res.json({ version });
  });

  return api;
};
