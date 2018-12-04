const Raven = require('raven');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const compression = require('compression');
const api = require('@youversion/js-api');
const httpProxy = require('http-proxy');
const ping = require('./ping');
const oauth = require('./oauth').default;
const localization = require('./localization').default;

const auth = api.tokenAuth;
const cors = require('cors');
const cookieParser = require('cookie-parser');

const SENTRY_DSN = process.env.SENTRY_DSN;

Raven.config(SENTRY_DSN).install()

require('babel-register')({ presets: [ 'env', 'react' ], plugins: [ 'transform-object-rest-spread', 'transform-function-bind', 'transform-object-assign', 'transform-class-properties', 'syntax-dynamic-import' ] });

const reactServer = require('./react-server');
const featureServer = require('./feature-server');
const yearInReviewServer = require('./snapshot-server');

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

if (process.env.DEBUG) {
	const proxy = httpProxy.createProxyServer({});
	app.use((req, res, next) => {
		if (req.url.match(new RegExp('^\/assets\/'))) {
			console.log('proxying request for: ', req.url)
			proxy.web(req, res, { target: 'http://localhost:9000' })
		} else {
			next();
		}
	})
} else {
	console.log('No Debug')
}

app.use(express.static(path.join(__dirname, 'public'), { maxage: '1y' }));

// oauth authentication
app.use('/oauth', oauth);
app.use('/authenticate', auth.expressAuthRouteHandler);
app.use('/localization', localization);
app.use('/', ping);
app.use('/', api.expressRouter);

// entry point for rails apps
app.use(featureServer);

// year in review image server
app.use(yearInReviewServer);

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
	res.status(err.status || 500).render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
