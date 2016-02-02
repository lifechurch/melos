import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import routes from './app/routes.js'
import Helmet from 'react-helmet'
import configureStore from './app/store/configureStore'
import defaultState from './app/defaultState'
import createNodeLogger from 'redux-node-logger'
import { createMemoryHistory } from 'react-router'
import { Provider } from 'react-redux'

const router = express.Router()

// router.get('/', function(req, res, next) {
// 	res.render('index', { appString: "", head: Helmet.rewind() });	
// });

router.get('/*', function(req, res) {
	match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
		if (error) {
			
			res.status(500).send(error.message);

		} else if (redirectLocation) {

			res.redirect(302, redirectLocation.pathname + redirectLocation.search);

		} else if (renderProps) {

			const logger = createNodeLogger()
			const history = createMemoryHistory()
			const store = configureStore(defaultState, history, logger)
			const html = renderToString(<Provider store={store}><RouterContext {...renderProps} /></Provider>)
			const initialState = store.getState()
			res.setHeader('Cache-Control', 'public');
			res.render('index', {appString: html, head: Helmet.rewind() })

		} else {
			res.status(404).send('Not found');

		}

	});


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