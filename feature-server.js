import 'babel-polyfill'
import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
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
import { addLocaleData, IntlProvider } from 'react-intl'
import getRoutes from './app/routes.js'
import createLogger from 'redux-node-logger'


const urlencodedParser = bodyParser.json()
const router = express.Router()
const availableLocales = require('./locales/config/availableLocales.json');
const localeList = require('./locales/config/localeList.json');

function getAssetPath(path) {
	const IS_PROD = process.env.NODE_ENV === 'production';
	if (IS_PROD) {
		return revManifest[path];
	} else {
		return path;
	}
}

function checkAuth(auth) {
	return new Promise((resolve, reject) => {
		if (typeof auth === 'object' && typeof auth.token === 'string') {
			// We have a token
			try {
				const token = auth.token
				const tokenData = tokenAuth.decodeToken(token)
				const sessionData = tokenAuth.decryptToken(tokenData.token)

				resolve({
					token: token,
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
				})
			} catch(err) {
				reject({error: 1, message: 'Invalid or Expired Token'})
			}

		} else if (typeof auth === 'object' && typeof auth.password === 'string') {
			// No token, but we have enough info to create one
			const sessionData = auth
			const token = tokenAuth.token(sessionData)
			resolve({
				token: token,
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
			})

		} else {
			resolve({
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
			})
		}
	})
}

function getAssetPrefix(req) {
	if (req.get('Host').indexOf('localhost') === -1) {
		return ['https://', req.get('Host')].join('')
	} else {
		return ['http://', req.get('Host')].join('')
	}
}

function getDefaultState(feature) {
	let defaultState = {}
	try {
		defaultState = require('./app/standalone/' + feature + '/defaultState').default
	} catch(ex) {
		defaultState = require('./app/defaultState').default
	}
	return defaultState
}

function getStore(feature, startingState, history, logger) {
	let configureStore = {}
	try {
		configureStore =  require('./app/standalone/' + feature + '/store').default
	} catch(ex) {
		configureStore = require('./app/store/configureStore').default
	}
	return configureStore(startingState, history, logger)
}

function getRootComponent(feature) {
	let rootComponent = {}
	try {
		rootComponent = require('./app/standalone/' + feature + '/rootComponent').default
	} catch(ex) {
		throw new Error('No root component defined')
	}
	return rootComponent
}

function mapStateToParams(feature, state, params) {
	try {
		const fn = require ('./app/standalone/' + feature + '/mapParamsToState').default
		return fn(state, params)
	} catch(ex) {
	 	return state
	}
}

function getConfig(feature) {
	const defaultConfig = { linkCss: true }
	let config = {}
	try {
		config = require('./app/standalone/' + feature + '/config').default
	} catch(ex) { }
	return Object.assign({}, defaultConfig, config)
}

function loadData(feature, params, startingState, sessionData, store) {
	return new Promise((resolve, reject) => {
		let fn = null
		try {
			fn = require('./app/standalone/' + feature + '/loadData').default
			resolve(fn(params, startingState, sessionData, store))
		} catch(ex) {
			resolve()
		}
	})
}

function getLocale(languageTag) {
	let final = {}

	if (typeof languageTag === 'undefined' || languageTag === null || languageTag === '' || availableLocales[languageTag] === 'undefined') {
		final = { locale: availableLocales['en-US'], source: 'default' }
	} else {
		final = { locale: availableLocales[languageTag], source: 'param' }
	}

	// Get the appropriate react-intl locale data for this locale
	var localeData = require('react-intl/locale-data/' + final.locale.split('-')[0]);
	final.data = localeData;

	// Get the appropriate set of localized strings for this locale
	final.messages = require('./locales/' + final.locale + '.json');

	for (const lc of localeList) {
		if (lc.locale === final.locale) {
			final.locale2 = lc.locale2
			final.locale3 = lc.locale3
			final.momentLocale = lc.momentLocale
		}
	}

	return final;
}

function getRenderProps(feature, url) {
	return new Promise((resolve, reject) => {
		let getRoutes = null
		try {
			getRoutes = require('./app/standalone/' + feature + '/routes.js').default
			const routes = getRoutes(null)
			match({ routes, location: url }, (error, redirectLocation, renderProps) => {
				if (!error && !redirectLocation && renderProps) {
					resolve(renderProps)
				} else {
					resolve({})
				}
			})
		} catch(ex) {
			resolve({})
		}
	})
}

router.post('/', urlencodedParser, function(req, res) {
	const { feature, params, auth } = req.body
	const assetPrefix = getAssetPrefix(req)
	const Locale = getLocale(params.languageTag)

	reactCookie.plugToRequest(req, res)

	let verifiedAuth = null
	checkAuth(auth).then((authResult) => {
		const sessionData = Object.assign({}, authResult.userData)
		authResult.userData.password = null
		verifiedAuth = authResult
		const defaultState = getDefaultState(feature)
		let startingState = Object.assign({}, defaultState, { auth: verifiedAuth })
		startingState = mapStateToParams(feature, startingState, params)
		try {
			const store = getStore(feature, startingState, null, null)
			loadData(feature, params, startingState, sessionData, store).then((action) => {
				if (typeof action === 'function') {
					store.dispatch(action).then(() => {
						finish()
					}, (err) => {
						finish()
					})
				} else if (typeof action === 'object') {
					store.dispatch(action);
					finish();
				} else {
					finish()
				}

				function finish() {
					const RootComponent = getRootComponent(feature)

					getRenderProps(feature, params.url).then((renderProps) => {
						let html = null
						try {
							 html = renderToString(<IntlProvider locale={Locale.locale} messages={Locale.messages}><Provider store={store}><RootComponent {...renderProps} /></Provider></IntlProvider>)
						} catch(ex) {
							return res.status(500).send({error: 3, message: 'Could Not Render ' + feature + ' view', ex })
						}

						const initialState = Object.assign({}, startingState, store.getState())
						const head = Helmet.rewind()
						res.setHeader('Cache-Control', 'public')
						res.render('standalone', {appString: html, initialState: initialState, environment: process.env.NODE_ENV, getAssetPath: getAssetPath, assetPrefix: assetPrefix, config: getConfig(feature), locale: Locale }, function(err, html) {
							res.send({ html, head, token: initialState.auth.token, js: assetPrefix + '/javascripts/' + getAssetPath(feature + '.js') })
						})
					})
				}

			}, (error) => {
				res.status(404).send(error)
			})
		} catch(ex) {
			res.status(500).send({error: 2, message: 'Could not render ' + feature + ' view', ex })
		}
	}, (authError) => {
		return res.status(403).send(authError)
	})
})

module.exports = router;