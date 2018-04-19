/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */
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
import isTimestampExpired from '@youversion/utils/lib/time/isTimestampExpired'
import { IntlProvider } from 'react-intl'
import moment from 'moment'
import Raven from 'raven'
import { renderStatic } from 'glamor/server'
import { getToken, refreshToken } from './oauth'
import { getLocale } from './app/lib/langUtils'

const urlencodedParser = bodyParser.json()
const router = express.Router()

const getAssetPath = (path) => {
	if (process.env.DEBUG) {
		return path
	} else {
		try {
			const Manifest = require('./public/assets/manifest.json')
			return Manifest[path];
		} catch (ex) {
			console.log(ex)
			if (__dirname) {
				console.log('CWD', __dirname)
			}
			return path
		}
	}
}

function massageSessionToOauth(sessionData) {
	const { tp_token, username, password } = sessionData
	const oauth = { username, password }
	if (tp_token) {
		if (tp_token.includes('Facebook')) {
			oauth.facebook = tp_token.replace('Facebook ', '')
		} else if (tp_token.includes('GoogleJWT')) {
			oauth.googlejwt = tp_token.replace('GoogleJWT ', '')
		}
	}
	return oauth
}

function buildAuth(auth, oauth) {
	return Object.assign(
		{},
		auth,
		{
			oauth: Object.assign(
				oauth,
				!('error' in oauth) ?
					{ valid_until: moment().add(oauth.expires_in, 'seconds').unix() } :
					null
			)
		}
	)
}

function oauthIsValid(response) {
	if ('error' in response) {
		return false
	} else return true
}

const checkAuth = (auth) => {
	return new Promise((resolve, reject) => {

		let authData = {
			token: null,
			isLoggedIn: false,
			isWorking: false,
			userData: {},
			user: null,
			oauth: {},
			password: null,
			errors: {
				api: null,
				fields: {
					user: null,
					password: null
				}
			}
		}

		let token
		let tokenData
		let sessionData
		let hasAuth = false
		let tp_token = null
		const oauthFromRails = auth && typeof auth === 'object' && auth.oauth

		// We have a token
		if (typeof auth === 'object' && typeof auth.token === 'string') {
			try {
				hasAuth = true
				const tokenPieces = auth.token.split(tokenAuth.tokenDelimiter)
				token = tokenPieces[0]
				tp_token = tokenPieces[1]
				tokenData = tokenAuth.decodeToken(token)
				sessionData = tokenAuth.decryptToken(tokenData.token)
				authData = Object.assign(
					{},
					authData,
					{
						token: auth.token,
						isLoggedIn: true,
						userData: sessionData,
						user: sessionData.email,
					}
				)
			} catch (err) {
				reject({ error: 1, message: 'Invalid or Expired Token' })
			}

		// No token, but we have enough info to create one
		} else if (typeof auth === 'object' && (typeof auth.password === 'string' || typeof auth.tp_token === 'string')) {
			hasAuth = true
			sessionData = auth
			// remove oauth from userData because it's top level
			if ('oauth' in sessionData) delete sessionData.oauth
			tp_token = auth.tp_token
			delete sessionData.tp_token
			token = `${tokenAuth.token(sessionData)}${tokenAuth.tokenDelimiter}${tp_token}`
			authData = Object.assign(
				{},
				authData,
				{
					token,
					isLoggedIn: true,
					userData: sessionData,
					user: sessionData.email,
				}
			)
		}

		if (hasAuth) {
			// figure out if we need to get a new oauth token
			// we have oauth data from rails cookie
			if (oauthFromRails && 'access_token' in oauthFromRails) {
				// but it has expired
				if (isTimestampExpired(oauthFromRails.valid_until)) {
					refreshToken({ refresh_token: oauthFromRails.refresh_token }).then((oauth) => {
						if (oauthIsValid(oauth)) {
							resolve(buildAuth(authData, oauth))
						} else {
							resolve(authData)
							// reject(oauth)
						}
					})
				// hasn't expired yet, we can reuse the data from cookies after making
				// sure the cookie has no error in it
				} else if (oauthIsValid(oauthFromRails)) {
					resolve(buildAuth(authData, oauthFromRails))
				} else {
					resolve(authData)
					// reject(oauthFromRails)
				}
			// we have no oauth data from rails so we need a new token from scratch
			} else {
				getToken(massageSessionToOauth({ ...sessionData, tp_token })).then((oauth) => {
					if (oauthIsValid(oauth)) {
						resolve(buildAuth(authData, oauth))
					} else {
						resolve(authData)
						// reject(oauth)
					}
				})
			}
		// no auth at all
		} else {
			resolve(authData)
		}
	})
}


const getAssetPrefix = (req) => {
	const ssl = !!process.env.SECURE_TRAFFIC || false
	const hostName = process.env.SECURE_HOSTNAME || req.get('Host')
	return `${ssl ? 'https' : 'http'}://${hostName}`
}

const getNodeHost = (req) => {
	return [req.protocol, '://', req.get('Host')].join('')
}

const getDefaultState = (feature) => {
	let defaultState = {}
	try {
		defaultState = require(`./app/standalone/${feature}/defaultState`).default
	} catch (ex) {
		defaultState = require('./app/defaultState').default
	}
	return defaultState
}

const getStore = (feature, startingState, history, logger) => {
	let configureStore = {}
	try {
		configureStore = require(`./app/standalone/${feature}/store`).default
	} catch (ex) {
		configureStore = require('./app/store/configureStore').default
	}
	return configureStore(startingState, history, logger)
}

const getRootComponent = (feature) => {
	let rootComponent = null
	try {
		rootComponent = require(`./app/standalone/${feature}/rootComponent`).default
	} catch (ex) {
		Raven.captureException(ex)
	}
	return rootComponent
}

const mapStateToParams = (feature, state, params) => {
	try {
		const fn = require(`./app/standalone/${feature}/mapParamsToState`).default
		return fn(state, params)
	} catch (ex) {
		return state
	}
}

const getConfig = (feature) => {
	const defaultConfig = { linkCss: true }
	let config = {}
	try {
		config = require(`./app/standalone/${feature}/config`).default
	} catch (ex) { }
	return Object.assign({}, defaultConfig, config)
}

const loadData = (feature, params, startingState, sessionData, store, Locale) => {
	return new Promise((resolve) => {
		let fn = null
		try {
			fn = require(`./app/standalone/${feature}/loadData`).default
			resolve(fn(params, startingState, sessionData, store, Locale))
		} catch (ex) {
			resolve()
		}
	})
}

const getRenderProps = (feature, url) => {
	return new Promise((resolve, reject) => {
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
				// We expect MODULE_NOT_FOUND errors because some features don't use routing
				//  but we want to capture any other exceptions here
				if (ex.code !== 'MODULE_NOT_FOUND') {
					// Don't report this error for now, too many false positives
					// Raven.captureException(ex)
				} else {
					reject(ex)
				}
			}
		}
		return resolve({})
	})
}

router.post('/featureImport/*', urlencodedParser, (req, res) => {
	const { feature, params, auth } = req.body
	const assetPrefix = getAssetPrefix(req)
	// const Locale = getLocale(params.languageTag)

	Raven.setContext({ user: auth, tags: { feature, url: params.url }, extra: { params } })

	reactCookie.plugToRequest(req, res)

	let verifiedAuth = null
	checkAuth(auth).then((authResult) => {
		const sessionData = Object.assign({}, authResult.userData)
		authResult.userData.password = null
		verifiedAuth = authResult
		const defaultState = getDefaultState(feature)
		let startingState = Object.assign({}, defaultState, { auth: verifiedAuth })
		startingState = mapStateToParams(feature, startingState, params)

		const Locale = getLocale({
			localeFromUrl: params.languageTag,
			localeFromCookie: params.cookiesLocale,
			localeFromUser: authResult && authResult.userData && authResult.userData.language_tag ? authResult.userData.language_tag : null,
			acceptLangHeader: params.acceptLangHeader
		})

		startingState.locale = { nativeName: Locale.nativeName }
		moment.locale(Locale.momentLocale)
		try {
			const history = createMemoryHistory()
			const initialState = Object.assign({}, startingState, { hosts: { nodeHost: getNodeHost(req), railsHost: params.railsHost } })
			const store = getStore(feature, initialState, history, null)
			loadData(feature, params, startingState, sessionData, store, Locale).then((action) => {
				const finish = () => {
					// console.log('FEATURE DATA', action)
					const RootComponent = getRootComponent(feature)

					if (RootComponent === null) {
						return res.status(500).send({ error: 4, message: `No root component defined for this feature: ${feature}` })
					}

					getRenderProps(feature, params.url).then((renderProps) => {
						let html, css = null
						try {
							({ html, css } = renderStatic(() => {
								return renderToString(<IntlProvider locale={ (Locale.locale2 === 'mn') ? Locale.locale2 : Locale.locale} messages={Locale.messages}><Provider store={store}><RootComponent {...renderProps} /></Provider></IntlProvider>)
							}))
						} catch (ex) {
								// throw new Error(`Error: 3 - Could Not Render ${feature} view`, ex)
							Raven.captureException(ex)
							return res.status(500).send({ error: 3, message: `Could Not Render ${feature} view`, ex, stack: ex.stack })
						}

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
						const storeState = store.getState()
						res.setHeader('Cache-Control', 'public')
						res.render('standalone', {
							appString: html,
							initialState: storeState,
							environment: process.env.NODE_ENV,
							getAssetPath,
							assetPrefix,
							config: getConfig(feature),
							locale: Locale,
							nodeHost: getNodeHost(req),
							railsHost: params.railsHost,
							referrer,
							appContainerSuffix: feature
						}, (err, renderedHtml) => {
							res.send({
								html: renderedHtml,
								head,
								oauth: verifiedAuth.oauth,
								token: storeState.auth.token,
								js: [
									{ name: 'polyfill', src: 'https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en,Number.isNaN,Promise' },
									{ name: 'raven', src: 'https://cdn.ravenjs.com/3.14.0/raven.min.js', crossOrigin: true },
									{ name: 'manifest', src: `${assetPrefix}/assets/${getAssetPath('manifest.js')}` },
									{ name: 'vendor', src: `${assetPrefix}/assets/${getAssetPath('vendor.js')}` },
									{ name: 'feature', src: `${assetPrefix}/assets/${getAssetPath(`${feature}.js`)}` }
								],
								css: [
									{ name: 'main', src: `${assetPrefix}/assets/${getAssetPath('main.css')}` }
								],
								css_inline: css
							})
						})
						return null
					}, (err) => {
						console.log('Render props error', err)
					})
				}
				if (typeof action === 'function') {
					store.dispatch(action).then(() => {
						finish()
					}, () => {
						finish()
					})
				} else if (typeof action === 'object') {
					store.dispatch(action);
					finish();
				} else {
					finish()
				}
			}, (errorDetail) => {
				Raven.mergeContext({ extra: { errorDetail, params } })
				Raven.captureException(new Error(`LoadData Error - Could Not Render ${feature} view`))
				res.status(404).send(errorDetail)
			})
		} catch (ex) {
			Raven.captureException(ex)
			res.status(500).send({ error: 2, message: `Could not render ${feature} view`, ex })
		}
	}, (authError) => {
		res.status(403).send(authError)
	})
})

module.exports = router;
