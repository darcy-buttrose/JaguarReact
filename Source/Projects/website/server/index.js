/* eslint consistent-return:0 */

import express from 'express';
import cors from 'cors';
import { resolve } from 'path';
import bodyParser from 'body-parser';
import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import logger from './logger';

import argv from './argv';

import setup from './middlewares/frontendMiddleware';
import config from './config.json';
import api from './api';

const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const app = express();

app.use(cors(config.serverAppSettings.cors));

app.use(bodyParser.json({
  limit: config.serverAppSettings.bodyLimit
}));

passport.use(new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.serverAppSettings.passport.secretOrKey,
}, (jwtPayload, callBack) => {
  console.log(`Auth: ${JSON.stringify(jwtPayload)}`);
  return callBack(null, jwtPayload);
}));

app.use('/api', passport.authenticate('jwt', { session: false }), api({ config }));
app.get('/config', (req, res) => {
  res.send(Object.assign({}, config, {
    serverAppSettings: {},
  }))
});

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'app-build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';
const port = parseInt(argv.port || process.env.PORT || config.serverAppSettings.port || '3000', 10);

// Start your app.
app.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    ngrok.connect(port, (innerErr, url) => {
      if (innerErr) {
        return logger.error(innerErr);
      }

      logger.appStarted(port, prettyHost, url);
    });
  } else {
    logger.appStarted(port, prettyHost);
  }
});
