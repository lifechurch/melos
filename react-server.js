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
import moment from 'moment'
import rtlDetect from 'rtl-detect'

const router = express.Router()
const routes = getRoutes(null)
const availableLocales = require('./availableLocales.json');

function getAssetPath(path) {
	const IS_PROD = process.env.NODE_ENV === 'production';
	if (IS_PROD) {
		return revManifest[path];
	} else {
		return path;
	}
}

function getLocalesFromHeader(req) {
	return req.headers['accept-language'].split(',').map(function(l) {
		var locale = l.split(';');
		var weight = (locale.length > 1) ? parseFloat(locale[1].split('=')[1]) : 1;
		var prefix = locale[0].split('-')[0];
		return { locale: locale[0], prefix: prefix, weight: weight };
	});
}

function getLocale(req) {
	var defaultLocale = availableLocales['en'];
	var localeFromCookie;
	var final = { locale: defaultLocale, source: 'default' }
	var urlLocale = req.params[0].split('/')[0];
	var localesFromHeader = getLocalesFromHeader(req);

	// 1: Try URL First
	if (typeof availableLocales[urlLocale] !== 'undefined') {
		final = { locale: availableLocales[urlLocale], source: 'url' };

	// 2: Try Cookie Second
	} else if (typeof req.cookies.locale !== 'undefined' && typeof availableLocales[req.cookies.locale] !== 'undefined') {
		final = { locale: availableLocales[req.cookies.locale], source: 'cookie' };

	// 3: Try accept-language Header Third
	} else {
		var lastWeight = 0;
		var bestLocale;

		localesFromHeader.forEach(function(l) {
			if (l.weight > lastWeight) {
				if (typeof availableLocales[l.locale] !== 'undefined') {
					bestLocale = availableLocales[l.locale];
					lastWeight = l.weight;
				} else if (typeof availableLocales[l.prefix] !== 'undefined') {
					bestLocale = availableLocales[l.prefix];
					lastWeight = l.weight;
				}
			}
		});

		if (typeof bestLocale !== 'undefined' && bestLocale !== null) {
			final = { locale: bestLocale, source: 'accept-language' }
		}
	}

	final.messages = require('./locales/' + final.locale + '.json');
	var localeData = require('react-intl/locale-data/' + final.locale.split('-')[0]);
	final.data = localeData;
	final.preferredLocales = localesFromHeader;
	return final;
}

router.get('/*', cookieParser(), function(req, res) {
	req.Locale = getLocale(req);

	// This was a route with no language tag
	if (req.Locale.source !== 'url') {
		return res.redirect(302, '/' + req.Locale.locale + '/' + req.params[0]);
	}

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

				// Cookie should override language from token,
				//  because token is generated at login and could
				//  outdated
				const cookieLocale = reactCookie.load('locale')
				if (typeof cookieLocale !== 'undefined') {
					startingState.auth.userData.language_tag = cookieLocale
				}

				// Make sure User Profile Locale Takes Precedence over Everything
				const userProfileLocale = availableLocales[startingState.auth.userData.language_tag]
				console.log("LOCALE CHECK", req.Locale.locale, startingState.auth.userData.language_tag, userProfileLocale)
				if (req.Locale.locale !== userProfileLocale) {
					return res.redirect(302, '/' + userProfileLocale + '/');
				}

			} catch(err) {
				if (req.path !== '/' + req.Locale.locale + '/login') {
					redirecting = true
					res.redirect('/' + req.Locale.locale + '/login');
				}
			}

			if (!redirecting) {
				try {
					const logger = createNodeLogger()
					const history = createMemoryHistory()
					const store = configureStore(startingState, history, logger)
					const html = renderToString(<IntlProvider locale={req.Locale.locale} messages={req.Locale.messages}><Provider store={store}><RouterContext {...renderProps} /></Provider></IntlProvider>)
					const initialState = store.getState()
					console.log('hello')
					const rtl = rtlDetect.isRtlLang(req.Locale.locale)
					console.log('rtl', rtl)
					res.setHeader('Cache-Control', 'public');
					res.render('index', {appString: html, rtl: rtl, locale: req.Locale, head: Helmet.rewind(), initialState: initialState, environment: process.env.NODE_ENV, getAssetPath: getAssetPath })
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
