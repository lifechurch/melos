var express = require('express');
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var ReactRouter = require('react-router');
var RoutingContext = require('react-router').RoutingContext;
var ReactRoutes = require('./app/routes.js');
var Helmet = require('react-helmet');

var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('index', { appString: "", head: Helmet.rewind() });	
});

// router.get('*', function(req, res, next) {
// 	ReactRouter.match({ routes: ReactRoutes, location: req.url }, function(error, redirectLocation, renderProps) {
// 		if (error) {
// 			res.status(500).send(error.message);

// 		} else if (redirectLocation) {
// 			res.redirect(302, redirectLocation.pathname + redirectLocation.search);

// 		} else if (renderProps) {
// 			var appString = ReactDOMServer.renderToString(<RoutingContext {...renderProps} />);
// 			res.setHeader('Cache-Control', 'public');
// 			res.render('index', { appString: appString, head: Helmet.rewind() });

// 		} else {
// 			res.status(404).send('Not found');

// 		}
// 	});	
// });

module.exports = router;