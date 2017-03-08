import React from 'react'
import { render } from 'react-dom'
import { Router, useRouterHistory } from 'react-router'
import { Provider } from 'react-redux'
import { addLocaleData, IntlProvider } from 'react-intl'
import ReactGA from 'react-ga'
import { createHistory } from 'history'
import createLogger from 'redux-logger'

import configureStore from './store'
import getRoutes from './routes'
import BibleActionCreator from '../../features/Bible/actions/creators'
import PassageActionCreator from '../../features/Passage/actions/creators'
import defaultState from './defaultState'

// require('moment/min/locales')

let initialState = defaultState

const browserHistory = useRouterHistory(createHistory)({
	basename: '/'
})

if (typeof window !== 'undefined' && typeof window.__INITIAL_STATE__ !== 'undefined') {
	initialState = window.__INITIAL_STATE__
	ReactGA.initialize('UA-3571547-76')
}

let logger = null
if (typeof window !== 'undefined' && typeof window.__ENV__ !== 'undefined' && window.__ENV__ !== 'production') {
	logger = createLogger()
}

const store = configureStore(initialState, browserHistory, logger)
addLocaleData(window.__LOCALE__.data)
// moment.locale(window.__LOCALE__.locale)

function requireChapterData(nextState, replace, callback) {
	const currentState = store.getState()

	const {
		params: {
			version: nextVersion,
			book: nextBook,
			chapter: nextChapter,
		}
	} = nextState

	let isLoggedIn, currentUsfm, currentVersion
	let isInitialLoad = false

	try {
		({
			auth: {
				isLoggedIn
			},
			bibleReader: {
				chapter: {
					reference: {
						usfm: currentUsfm,
						version_id: currentVersion
					}
				}
			}
		} = currentState)
	} catch (ex) {
		isInitialLoad = true
	}

	const nextUsfm = `${nextBook}.${nextChapter}`
	const hasVersionChanged = isInitialLoad || (currentVersion ? (nextVersion.toString() !== currentVersion.toString()) : true)
	const hasChapterChanged = isInitialLoad || hasVersionChanged || (nextUsfm ? (nextUsfm.toLowerCase() !== currentUsfm.toLowerCase()) : true)

	if (!hasVersionChanged && !hasChapterChanged) {
		callback()
	} else {

		// Record page view with Google Analytics
		if (window.location.hostname === 'www.bible.com') {
			ReactGA.set({ page: `/${nextState.location.pathname}` })
			ReactGA.pageview(`/${nextState.location.pathname}`)
		}

    // Load data
		store.dispatch(
			BibleActionCreator.readerLoad({
				isInitialLoad,
				hasVersionChanged,
				hasChapterChanged,
				language_tag: window.__LOCALE__.locale3,
				version: nextVersion,
				reference: nextUsfm,
				params: nextState.params
			}, isLoggedIn))
		.then(() => {
			callback()
		},
			() => {
				store.dispatch(BibleActionCreator.handleInvalidReference({
					language_tag: window.__LOCALE__.locale3,
					version: nextVersion,
					reference: nextUsfm,
					params: nextState.params
				}, isLoggedIn)).then(() => {
					callback()
				})
			}
		)
	}
}

function requireVerseData(nextState, replace, callback) {
	const currentState = store.getState()

	const {
		params: {
			version: nextVersion,
			book: nextBook,
			chapter: nextChapter,
			verse: nextVerse
		}
	} = nextState

	const {
		serverLanguageTag,
		altVersions,
		auth: {
			isLoggedIn
		},
		passage: {
			verses: {
				primaryVersion: {
					version: currentVersion,
					passage: currentUsfm
				}
			}
		}
	} = currentState

	const nextUsfm = `${nextBook}.${nextChapter}.${nextVerse}`
	const hasVersionChanged = nextVersion.toString() !== currentVersion.toString()
	const hasVerseChanged = nextUsfm.toLowerCase() !== currentUsfm.toLowerCase()

	if (!hasVersionChanged && !hasVerseChanged) {
		callback()
	} else if (hasVersionChanged && !hasVerseChanged) {
		store.dispatch(PassageActionCreator.selectPrimaryVersion(nextVersion))
		callback()
	} else {
		if (window.location.hostname === 'www.bible.com') {
			ReactGA.set({ page: `/${nextState.location.pathname}` })
			ReactGA.pageview(`/${nextState.location.pathname}`)
		}
		store.dispatch(
			PassageActionCreator.passageLoad({
				isInitialLoad: false,
				hasVersionChanged,
				hasVerseChanged,
				language_tag: window.__LOCALE__.planLocale,
				versions: [ parseInt(nextVersion, 10), ...altVersions[serverLanguageTag].text ],
				passage: nextUsfm
			}, isLoggedIn)
		).then(
			() => { callback() },
			() => { callback() }
		)
	}
}

const routes = getRoutes(requireChapterData, requireVerseData)

render(
	<IntlProvider locale={window.__LOCALE__.locale} messages={window.__LOCALE__.messages}>
		<Provider store={store}>
			<Router routes={routes} history={browserHistory} onUpdate={() => { return window.scrollTo(0, 0) }} />
		</Provider>
	</IntlProvider>,
  document.getElementById('react-app')
)
