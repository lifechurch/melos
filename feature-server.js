import nr from 'newrelic'
import 'babel-polyfill'
import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import Helmet from 'react-helmet'
import { match, createMemoryHistory } from 'react-router'
import { Provider } from 'react-redux'
import reactCookie from 'react-cookie'
import bodyParser from 'body-parser'
import { tokenAuth } from '@youversion/js-api'
import { IntlProvider } from 'react-intl'
import moment from 'moment'

import planLocales from './locales/config/planLocales.json'
import revManifest from './rev-manifest.json'

const urlencodedParser = bodyParser.json()
const router = express.Router()
const availableLocales = require('./locales/config/availableLocales.json');
const localeList = require('./locales/config/localeList.json');

const Raven = require('raven');

Raven.config('https://cc7248185fe54b72a7419782feb9f483:dd4bdec0c223479cbc7ba5231d89507f@sentry.io/149323').install()

const getAssetPath = nr.createTracer('fnGetAssetPath', (path) => {
	const IS_PROD = process.env.NODE_ENV === 'production';
	if (IS_PROD) {
		return revManifest[path];
	} else {
		return path;
	}
})

const checkAuth = nr.createTracer('fnCheckAuth', (auth) => {
	return new Promise((resolve, reject) => {
		if (typeof auth === 'object' && typeof auth.token === 'string') {
			// We have a token
			try {
				const token = auth.token
				const tokenData = tokenAuth.decodeToken(token)
				const sessionData = tokenAuth.decryptToken(tokenData.token)

				resolve({
					token,
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
			} catch (err) {
				reject({ error: 1, message: 'Invalid or Expired Token' })
			}

		} else if (typeof auth === 'object' && (typeof auth.password === 'string' || typeof auth.tp_token === 'string')) {
			// No token, but we have enough info to create one
			const sessionData = auth
			const token = tokenAuth.token(sessionData)
			resolve({
				token,
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
})

const getAssetPrefix = nr.createTracer('fnGetAssetPrefix', (req) => {
	if (req.get('Host').indexOf('localhost') === -1) {
		return ['https://', req.get('Host')].join('')
	} else {
		return ['http://', req.get('Host')].join('')
	}
})

const getNodeHost = nr.createTracer('fnGetNodeHost', (req) => {
	return [req.protocol, '://', req.get('Host')].join('')
})

const getDefaultState = nr.createTracer('fnGetDefaultState', (feature) => {
	let defaultState = {}
	try {
		defaultState = require(`./app/standalone/${feature}/defaultState`).default
	} catch (ex) {
		defaultState = require('./app/defaultState').default
	}
	return defaultState
})

const getStore = nr.createTracer('fnGetStore', (feature, startingState, history, logger) => {
	let configureStore = {}
	try {
		configureStore = require(`./app/standalone/${feature}/store`).default
	} catch (ex) {
		configureStore = require('./app/store/configureStore').default
	}
	return configureStore(startingState, history, logger)
})

const getRootComponent = nr.createTracer('fnGetRootComponent', (feature) => {
	let rootComponent = null
	try {
		rootComponent = require(`./app/standalone/${feature}/rootComponent`).default
	} catch (ex) {
		Raven.captureException(ex)
	}
	return rootComponent
})

const mapStateToParams = nr.createTracer('fnMapStateToParams', (feature, state, params) => {
	try {
		const fn = require(`./app/standalone/${feature}/mapParamsToState`).default
		return fn(state, params)
	} catch (ex) {
		return state
	}
})

const getConfig = nr.createTracer('fnGetConfig', (feature) => {
	const defaultConfig = { linkCss: true }
	let config = {}
	try {
		config = require(`./app/standalone/${feature}/config`).default
	} catch (ex) { }
	return Object.assign({}, defaultConfig, config)
})

const loadData = nr.createTracer('fnLoadData', (feature, params, startingState, sessionData, store, Locale) => {
	return new Promise(nr.createTracer('fnLoadData::promise', (resolve) => {
		let fn = null
		try {
			fn = require(`./app/standalone/${feature}/loadData`).default
			resolve(fn(params, startingState, sessionData, store, Locale))
		} catch (ex) {
			resolve()
		}
	}))
})

const getLocale = nr.createTracer('fnGetLocale', (languageTag) => {
	let final = {}

	if (typeof languageTag === 'undefined' || languageTag === null || languageTag === '' || typeof availableLocales[languageTag] === 'undefined') {
		final = { locale: availableLocales['en-US'], source: 'default' }
	} else {
		final = { locale: availableLocales[languageTag], source: 'param' }
	}

	// Get the appropriate set of localized strings for this locale
	final.messages = require(`./locales/${final.locale}.json`);

	for (const lc of localeList) {
		if (lc.locale === final.locale) {
			final.locale2 = lc.locale2
			final.locale3 = lc.locale3
			final.momentLocale = lc.momentLocale
			final.planLocale = planLocales[lc.locale]
		}
	}
	// Get the appropriate react-intl locale data for this locale
	const localeData = require(`react-intl/locale-data/${final.locale2}`);
	final.data = localeData;

	moment.locale(final.momentLocale)
	return final;
})

const getRenderProps = nr.createTracer('fnGetRenderProps', (feature, url) => {
	return new Promise(nr.createTracer('fnGetRenderProps::promsie', (resolve) => {
		if (url !== null && typeof url === 'string' && url.length > 0) {
			let getRoutes = null
			try {
				getRoutes = require(`./app/standalone/${feature}/routes.js`).default
				const routes = getRoutes(null)
				match({ routes, location: url }, (error, redirectLocation, renderProps) => {
					if (!error && !redirectLocation && renderProps) {
						resolve(renderProps)
					}
				})
			} catch (ex) {
				Raven.captureException(ex)
			}
		}
		return resolve({})
	}))
})

router.post('/featureImport/*', urlencodedParser, (req, res) => {
	const { feature, params, auth } = req.body
	const assetPrefix = getAssetPrefix(req)
	const Locale = getLocale(params.languageTag)

	nr.setTransactionName(`featureImport/${feature}`)

	Raven.setContext({ user: auth, tags: { feature, url: params.url }, extra: { params } })

	reactCookie.plugToRequest(req, res)

	let verifiedAuth = null
	checkAuth(auth).then(nr.createTracer('checkingAuth', (authResult) => {
		const sessionData = Object.assign({}, authResult.userData)
		authResult.userData.password = null
		verifiedAuth = authResult
		const defaultState = getDefaultState(feature)
		let startingState = Object.assign({}, defaultState, { auth: verifiedAuth })
		startingState = mapStateToParams(feature, startingState, params)

		try {
			const history = createMemoryHistory()
			const store = getStore(feature, startingState, history, null)
			loadData(feature, params, startingState, sessionData, store, Locale).then(nr.createTracer('loadData', (action) => {
				const finish = nr.createTracer('finish', () => {
					const RootComponent = getRootComponent(feature)

					if (RootComponent === null) {
						res.status(500).send({ error: 4, message: `No root component defined for this feature: ${feature}` })
						nr.endTransaction()
					}

					getRenderProps(feature, params.url).then(nr.createTracer('getRenderProps', (renderProps) => {
						let html = null
						try {
							html = renderToString(<IntlProvider locale={ (Locale.locale2 === 'mn') ? Locale.locale2 : Locale.locale} messages={Locale.messages}><Provider store={store}><RootComponent {...renderProps} /></Provider></IntlProvider>)
						} catch (ex) {
								// throw new Error(`Error: 3 - Could Not Render ${feature} view`, ex)
							Raven.captureException(ex)
							res.status(500).send({ error: 3, message: `Could Not Render ${feature} view`, ex, stack: ex.stack })
							nr.endTransaction()
						}

						const initialState = Object.assign({}, startingState, store.getState(), { hosts: { nodeHost: getNodeHost(req), railsHost: params.railsHost } })

						let head = Helmet.rewind()

						head = {
							base: head.base.toString(),
							meta: head.meta.toString(),
							link: head.link.toString(),
							title: head.title.toString(),
							script: head.script.toString()
						}

							// for lookinside stuff
						let referrer = null
						if (params.referrer) {
							referrer = params.referrer
						}

						res.setHeader('Cache-Control', 'public')
						res.render('standalone', { appString: html, initialState, environment: process.env.NODE_ENV, getAssetPath, assetPrefix, config: getConfig(feature), locale: Locale, nodeHost: getNodeHost(req), railsHost: params.railsHost, referrer }, nr.createTracer('render', (err, html) => {
							res.send({ html, head, token: initialState.auth.token, js: `${assetPrefix}/javascripts/${getAssetPath(`${feature}.js`)}` })
							nr.endTransaction()
						}))

						return null
					}))
				})

				if (typeof action === 'function') {
					store.dispatch(action).then(nr.createTracer('actionIsFn::success', () => {
						finish()
					}), nr.createTracer('actionIsFn::failure', () => {
						finish()
					}))
				} else if (typeof action === 'object') {
					store.dispatch(action);
					finish();
				} else {
					finish()
				}
			}), nr.createTracer('loadDataFailed', (error) => {
					// throw new Error(`LoadData Error - Could Not Render ${feature} view`, error)
				Raven.captureException(error)
				res.status(404).send(error)
				nr.endTransaction()
			}))
		} catch (ex) {
				// throw new Error(`Error: 2 - Could Not Render ${feature} view`, ex)
			Raven.captureException(ex)
			res.status(500).send({ error: 2, message: `Could not render ${feature} view`, ex })
			nr.endTransaction()
		}
	}), nr.createTracer('authFailed', (authError) => {
		res.status(403).send(authError)
		nr.endTransaction()
	}))
})

module.exports = router;
