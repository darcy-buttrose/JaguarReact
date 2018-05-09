import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';
import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

passport.use(new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey   : '_8r+3j7)w-d&qk1!@+e+-8u-y_e3kyz!vg#9h&(mic-9e(hn*6'
}, (jwtPayload, callBack) => {
    console.log(`Auth: ${JSON.stringify(jwtPayload)}`);
    return callBack(null, jwtPayload);
}));

// connect to db
initializeDb( db => {

	// internal middleware
	app.use(middleware({ config, db }));

	// api router
	app.use('/api', passport.authenticate('jwt', {session: false}) , api({ config, db }));

	app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${app.server.address().port}`);
	});
});

export default app;
