require('newrelic');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var compression = require('compression');
var api = require('@youversion/js-api');
var ping = require('./ping');
var auth = api.tokenAuth;

require("babel-register")({ presets: [ "es2015", "react" ], plugins: [ "transform-object-rest-spread", "transform-function-bind" ] });

var reactServer = require('./react-server');
var featureServer = require('./feature-server');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(compression({
	threshold: 512
}));

var sslExcludedPaths = [
	'/running',
	'/ping'
];

var forceSsl = function(req, res, next) {
	if (req.headers['x-forwarded-proto'] !== 'https' && req.get('Host').indexOf('localhost') === -1 && sslExcludedPaths.indexOf(req.url) === -1) {
		var host = req.get('Host');
		return res.redirect(['https://', host, req.url].join(''));
	}
	return next();
};

app.use(forceSsl);

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/authenticate', auth.expressAuthRouteHandler);
app.use('/', ping);
app.use('/', api.expressRouter);

//entry point for rails apps
app.use('/featureImport', featureServer);

// primary route handle for react-router
app.use(reactServer);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

app.use(function(err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		res.status(401).send({status: 401, message: 'Invalid Token' });
	}
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
