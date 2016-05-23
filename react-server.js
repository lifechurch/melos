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

/**
 * Parses the accept-language HTTP header and
 * returns an array of Objects with the following
 * keys:
 *  - locale: this is the full locale, ISO 639-1
 *  - prefix: this is the language portion of a locale, ISO 639-2
 *  - weight: some browsers associate a weight value to a locale between 0 and 1
 * @param {Object} req - the Express request object
 */
function getLocalesFromHeader(req) {
	return req.headers['accept-language'].split(',').map(function(l) {
		var locale = l.split(';');
		var weight = (locale.length > 1) ? parseFloat(locale[1].split('=')[1]) : 1;
		var prefix = locale[0].split('-')[0];
		return { locale: locale[0], prefix: prefix, weight: weight };
	});
}

/**
 * Gets the Locale of the User by checking the
 * following places in order:
 *
 *  1) URL: assuming an explicit URL should take first priority
 *  2) Cookie: a cookie is only written when a user explicitly switches to a language/locale
 *  3) Profile: the user's profile is only update when a user explicitly switches to a language/locale
 *  4) Browser: also known as the accept-language header, this is the final fallback to a configuration setting in the browser
 *
 * @param {Object} req - the Express request object
 * @param {string} profileLanguageTag - the ISO 639-1 language code from the User's profile
 */
function getLocale(req, profileLanguageTag) {
	var defaultLocale = availableLocales['en-US'];
	var final = { locale: defaultLocale, source: 'default' }
	var urlLocale = req.params[0].split('/')[0];
	var localesFromHeader = getLocalesFromHeader(req);

	// 1: Try URL First
	if (typeof availableLocales[urlLocale] !== 'undefined') {
		final = { locale: availableLocales[urlLocale], source: 'url' };

	// 2: Try Cookie Second
	} else if (typeof req.cookies.locale !== 'undefined' && typeof availableLocales[req.cookies.locale] !== 'undefined') {
		final = { locale: availableLocales[req.cookies.locale], source: 'cookie' };

	// 3: Try User Profile Info (from token of last login)
	} else if (typeof profileLanguageTag !== 'undefined' && profileLanguageTag !== null && typeof availableLocales[profileLanguageTag] !== 'undefined') {
		final = { locale: availableLocales[profileLanguageTag], source: 'profile' };

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

	// Get the appropriate react-intl locale data for this locale
	var localeData = require('react-intl/locale-data/' + final.locale.split('-')[0]);
	final.data = localeData;

	// Get the appropriate set of localized strings for this locale
	final.messages = require('./locales/' + final.locale + '.json');

	// Add the list of preferred locales based on browser configuration to this response
	final.preferredLocales = localesFromHeader;

	// Loop Through Locale List and Get More Info
	for (const lc of localeList) {
		if (lc.locale === final.locale) {
			final.locale2 = lc.locale2
			final.locale3 = lc.locale3
			final.momentLocale = lc.momentLocale
		}
	}

	return final;
}

/**
 * Gets the User State from the JSON Web Token
 * that's plugged into react-cookie
 */
function getStateFromToken() {
	let sessionData = {}
	const token = fetchToken()
	const tokenData = tokenAuth.decodeToken(token)
	sessionData = tokenAuth.decryptToken(tokenData.token)
	delete sessionData.password
	return Object.assign({}, defaultState, { auth: {
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
}

/**
 * Entry point for handling React app URLs
 */
router.get('/*', cookieParser(), function(req, res) {
	reactCookie.plugToRequest(req, res)

	let startingState = defaultState

	try {
		startingState = getStateFromToken()
	} catch(err) {

	}

	const profileLanguageTag = startingState !== null &&
		typeof startingState !== 'undefined' &&
		typeof startingState.auth !== 'undefined' &&
		typeof startingState.auth.userData !== 'undefined' &&
		typeof startingState.auth.userData.language_tag ? startingState.auth.userData.language_tag : null

	req.Locale = getLocale(req, profileLanguageTag);

	// We are not authenticated
	if (!startingState.auth.isLoggedIn && req.path !== '/' + req.Locale.locale + '/login') {
		return res.redirect('/' + req.Locale.locale + '/login');

	// This was a route with no language tag
	} else if (req.Locale.source !== 'url') {

		//Try to be smart... did the user intend this to include a language in URL?
		const firstPathSegment = req.params[0].split('/')[0]
		const pathWithoutFirstSegment = req.params[0].split('/').slice(1)
		let newUrl = null

		if (/^[a-zA-Z]{2}(?:[-_][a-zA-Z]{2})?$/.test(firstPathSegment)) {
			newUrl = '/' + req.Locale.locale + '/' + pathWithoutFirstSegment
		} else {
			newUrl = '/' + req.Locale.locale + '/' + req.params[0]
		}

		return res.redirect(302, newUrl);
	}

	match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
		if (error) {
			console.log("ERROR", error);
			res.status(500).send(error.message);

		} else if (redirectLocation) {

			res.redirect(302, redirectLocation.pathname + redirectLocation.search);

		} else if (renderProps) {

			try {
				const logger = createNodeLogger()
				const history = createMemoryHistory()
				const store = configureStore(startingState, history, logger)
				const html = renderToString(<IntlProvider locale={req.Locale.locale} messages={req.Locale.messages}><Provider store={store}><RouterContext {...renderProps} /></Provider></IntlProvider>)
				const initialState = store.getState()
				const rtl = rtlDetect.isRtlLang(req.Locale.locale)
				res.setHeader('Cache-Control', 'public');
				res.render('index', {appString: html, rtl: rtl, locale: req.Locale, head: Helmet.rewind(), initialState: initialState, environment: process.env.NODE_ENV, getAssetPath: getAssetPath })
			} catch(ex) {
				console.log('ex', ex);
				res.status(500).send()
			}

		} else {

			res.status(404).send('Not found');

		}
	});
});

module.exports = router;
