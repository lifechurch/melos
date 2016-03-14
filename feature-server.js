import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import getRoutes from './app/standalone/EventView/routes.js'
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
import bodyParser from 'body-parser'
import { getClient } from '@youversion/js-api'

const urlencodedParser = bodyParser.json()
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

router.post('/event', urlencodedParser, function(req, res) {
	let assetPrefix = null

	if (req.get('Host').indexOf('localhost') === -1) {
		assetPrefix = ['https://', req.get('Host')].join('')
	} else {
		assetPrefix = ['http://', req.get('Host')].join('')
	}

	match({ routes, location: '/events/' + req.body.id }, (error, redirectLocation, renderProps) => {
		if (error) {
			res.status(500).send({ error: 0, message: error.message });

		} else if (renderProps) {
			reactCookie.plugToRequest(req, res)

			let token = null
			let tokenData = null
			let sessionData = {}
			let startingState = defaultState

			if (typeof req.body.auth === 'object' && typeof req.body.auth.token === 'string') {
				// We have a token
				try {
					token = req.body.auth.token
					tokenData = tokenAuth.decodeToken(token)
					sessionData = tokenAuth.decryptToken(tokenData.token)

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
					return res.status(403).send({error: 1, message: 'Invalid or Expired Token'})
				}

			} else if (typeof req.body.auth === 'object' && typeof req.body.auth.password === 'string') {
				// No token, but we have enough info to create one
				sessionData = req.body.auth
				token = tokenAuth.token(sessionData)

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

			} else {
				startingState = Object.assign({}, defaultState, { auth: {
					token: null,
					isLoggedIn: false,
					isWorking: false,
					userData: {},
					user: null,
					password: null,
					errors: {
						api: null,
						fields: {
							user: null,
							password: null
						}
					}
				}})
			}

			try {
				const client = getClient('events')
					.call('view')
					.setVersion('3.2')
					.setEnvironment(process.env.NODE_ENV)
					.params({ id: req.body.id })

				if (startingState.auth.isLoggedIn === true) {
					client.auth(sessionData.email , sessionData.password)
				}

				client.get().then((response) => {
					const history = createMemoryHistory()

					if (typeof response.errors !== 'undefined') {
						return res.status(404).send({error:4, message: 'Could not find Event.'})
					}

					const store = configureStore(startingState, history, null)
					store.dispatch({ type: 'EVENT_VIEW_SUCCESS', response })

					const html = renderToString(<Provider store={store}><RouterContext {...renderProps} /></Provider>)
					const initialState = store.getState()
					const head = Helmet.rewind()
					res.setHeader('Cache-Control', 'public')
					res.render('standalone', {appString: html, initialState: initialState, environment: process.env.NODE_ENV, getAssetPath: getAssetPath, assetPrefix: assetPrefix }, function(err, html) {
						res.send({ html, token, head, js: assetPrefix + '/javascripts/' + getAssetPath('eventView.js') })
					})
				}, (error) => {
					res.status(404).send({error:4, message: 'Could not find Event.'})
				})

			} catch(ex) {
				res.status(500).send({error: 2, message: 'Could not render Event view'})
			}

		} else {
			res.status(404).send({ error: 3, message: 'Not found' });
		}

	})
})

module.exports = router;