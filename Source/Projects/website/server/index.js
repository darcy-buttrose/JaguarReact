/* eslint consistent-return:0 */

import express from 'express';
import cors from 'cors';
import { resolve } from 'path';
import bodyParser from 'body-parser';
import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import logger from './logger';

import argv from './argv';
import port from './port';

import setup from './middlewares/frontendMiddleware';
import config from './config.json';
import api from './api';

const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const app = express();

app.use(cors());

app.use(bodyParser.json({
  limit: config.bodyLimit
}));

passport.use(new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.passport.secretOrKey,
}, (jwtPayload, callBack) => {
  console.log(`Auth: ${JSON.stringify(jwtPayload)}`);
  return callBack(null, jwtPayload);
}));

// api router
app.use('/api', passport.authenticate('jwt', { session: false }), api({ config }));

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'app-build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

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
