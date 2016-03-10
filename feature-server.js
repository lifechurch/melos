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
import bodyParser from 'body-parser'

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

router.post('/event/:id', urlencodedParser, function(req, res) {
	let assetPrefix = null
	if (req.get('Host').indexOf('localhost') === -1) {
		assetPrefix = ['https://', req.get('Host')].join('')
	} else {
		assetPrefix = ['http://', req.get('Host')].join('')
	}

	match({ routes, location: '/event/view/' + req.params.id }, (error, redirectLocation, renderProps) => {
		if (error) {

			res.status(500).send(error.message);

		} else if (redirectLocation) {

			//res.redirect(302, redirectLocation.pathname + redirectLocation.search);

		} else if (renderProps) {
			reactCookie.plugToRequest(req, res)

			let sessionData = {}
			let startingState = defaultState

			try {
				const token = req.body.token
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
				return res.status(501).send({fail:1, err: err})
			}

			try {
				const logger = createNodeLogger()
				const history = createMemoryHistory()
				const store = configureStore(startingState, history, logger)
				const html = renderToString(<Provider store={store}><RouterContext {...renderProps} /></Provider>)
				const initialState = store.getState()
				res.setHeader('Cache-Control', 'public');
				// res.send({appString: html, head: Helmet.rewind(), initialState: initialState, environment: process.env.NODE_ENV })
				res.render('standalone', {appString: html, head: Helmet.rewind(), initialState: initialState, environment: process.env.NODE_ENV, getAssetPath: getAssetPath, assetPrefix: assetPrefix }, function(err, html) {
					res.send({html: html})
				})
			} catch(ex) {
				console.log(ex)
				res.status(500).send({fail:2, ex: ex})
			}

		} else {
			res.status(404).send('Not found');
		}

	})
})

module.exports = router;