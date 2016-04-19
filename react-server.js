import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import getRoutes from './app/routes.js'
import Helmet from 'react-helmet'
import configureStore from './app/store/configureStore'
import defaultState from './app/defaultState'
import createNodeLogger from 'redux-node-logger'
import { createMemoryHistory } from 'react-router'
import { Provider } from 'react-redux'
import cookieParser from 'cookie-parser'
import reactCookie from 'react-cookie'
import { fetchToken } from '@youversion/token-storage'
import { tokenAuth } from '@youversion/js-api'
import revManifest from './rev-manifest.json'
import { IntlProvider } from 'react-intl'
import enUs from './locales/en-US.json'

const router = express.Router()
const routes = getRoutes(null)

function getAssetPath(path) {
	const IS_PROD = process.env.NODE_ENV === 'production';
	if (IS_PROD) {
		return revManifest[path];
	} else {
		return path;
	}
}

router.get('/*', cookieParser(), function(req, res) {
	match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
		if (error) {
			console.log("ERROR", error);
			res.status(500).send(error.message);

		} else if (redirectLocation) {

			res.redirect(302, redirectLocation.pathname + redirectLocation.search);

		} else if (renderProps) {

			reactCookie.plugToRequest(req, res)

			let sessionData = {}
			let startingState = defaultState
			let redirecting = false
			try {
				const token = fetchToken()
				const tokenData = tokenAuth.decodeToken(token)
				sessionData = tokenAuth.decryptToken(tokenData.token)
				delete sessionData.password

				startingState = Object.assign({}, defaultState, { auth: {
					token: null,
					isLoggedIn: true,
					isWorking: false,
					userData: sessionData,
					user: sessionData.email,
					password: null,
					errors: {
						api: null,
						fields: {
							user: null,
							password: null
						}
					}
				}})

			} catch(err) {
				if (req.path !== '/login') {
					redirecting = true
					res.redirect('/login');
				}
			}

			if (!redirecting) {
				try {
					const logger = createNodeLogger()
					const history = createMemoryHistory()
					const store = configureStore(startingState, history, logger)
					const html = renderToString(<IntlProvider locale="en" messages={enUs}><Provider store={store}><RouterContext {...renderProps} /></Provider></IntlProvider>)
					const initialState = store.getState()
					res.setHeader('Cache-Control', 'public');
					res.render('index', {appString: html, head: Helmet.rewind(), initialState: initialState, environment: process.env.NODE_ENV, getAssetPath: getAssetPath })
				} catch(ex) {
					console.log('ex', ex);
					res.status(500).send()
				}
			}

		} else {

			res.status(404).send('Not found');

		}
	});
});

module.exports = router;
