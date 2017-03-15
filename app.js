if (process.env.NODE_ENV === 'production') {
	require('newrelic');
}
const Raven = require('raven');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const compression = require('compression');
const api = require('@youversion/js-api');
const ping = require('./ping');
const auth = api.tokenAuth;
const cors = require('cors');
const cookieParser = require('cookie-parser');

Raven.config('https://488eeabd899a452783e997c6558e0852:14c79298cb364716a7877e9ace89a69e@sentry.io/129704').install()

require('babel-register')({ presets: [ 'es2015', 'stage-0', 'react' ], plugins: [ 'transform-object-rest-spread', 'transform-function-bind', 'transform-object-assign' ] });

const reactServer = require('./react-server');
const featureServer = require('./feature-server');

const app = express();
app.use(Raven.requestHandler());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(compression({
	threshold: 512
}));

app.use(cookieParser());

const sslExcludedPaths = [
	'/running',
	'/ping'
];

const forceSsl = function (req, res, next) {
	if (req.headers['x-forwarded-proto'] !== 'https' &&
		req.get('Host').indexOf('localhost') === -1 &&
		req.get('Host').indexOf('127.0.0.1') === -1 &&
		sslExcludedPaths.indexOf(req.url) === -1
	) {
		const host = req.get('Host');
		return res.redirect(['https://', host, req.url].join(''));
	}
	return next();
};

app.use(forceSsl);
app.use(cors({ origin: true }));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/authenticate', auth.expressAuthRouteHandler);
app.use('/', ping);
app.use('/', api.expressRouter);

// entry point for rails apps
app.use('/featureImport', featureServer);

// primary route handle for react-router
app.use(reactServer);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

app.use(Raven.errorHandler());

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use((err, req, res, next) => {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

app.use((err, req, res, next) => {
	if (err.name === 'UnauthorizedError') {
		res.status(401).send({ status: 401, message: 'Invalid Token' });
	}
});

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
