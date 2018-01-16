import React from 'react'
import { render } from 'react-dom'
import { Router, useRouterHistory } from 'react-router'
import { Provider } from 'react-redux'
import { addLocaleData, IntlProvider } from 'react-intl'
import ga from 'react-ga'
import { createHistory } from 'history'
import createLogger from 'redux-logger'
import { syncHistoryWithStore } from 'react-router-redux'
import cookie from 'react-cookie'
import isVerseOrChapter from '@youversion/utils/lib/bible/isVerseOrChapter'
import configureStore from './store'
import getRoutes from './routes'
import BibleActionCreator from '../../features/Bible/actions/creators'
import PassageActionCreator from '../../features/Passage/actions/creators'
import defaultState from './defaultState'
import '../../less/style.less'

if (typeof window !== 'undefined') {
	ga.initialize('UA-3571547-76', { language: window.__LOCALE__.locale });
}

function logPageView() {
	if (typeof window !== 'undefined') {
		if (window.location.hostname === 'www.bible.com') {
			ga.set({ page: window.location.pathname, location: window.location.href })
			ga.pageview(window.location.pathname);
		}
		window.scrollTo(0, 0)
	}
}

let initialState = defaultState

const browserHistory = useRouterHistory(createHistory)({
	basename: '/'
})

if (typeof window !== 'undefined' && typeof window.Bible.__INITIAL_STATE__ !== 'undefined') {
	initialState = window.Bible.__INITIAL_STATE__
}

let logger = null
if (typeof window !== 'undefined' && typeof window.__ENV__ !== 'undefined' && window.__ENV__ !== 'production') {
	logger = createLogger()
}

const store = configureStore(initialState, browserHistory, logger)
const history = syncHistoryWithStore(browserHistory, store)

addLocaleData(window.__LOCALE__.data)

function requireChapterData(nextState, replace, callback, force = false) {
	const currentState = store.getState()

	let {
		params: {
			version: nextVersion,
			book: nextBook,
			chapter: nextChapter,
		}
	} = nextState

	let isLoggedIn, currentUsfm, currentVersion, currentParallelVersionId
	let query = {}
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
				},
				parallelVersion: {
					id: currentParallelVersionId
				}
			},
			routing: {
				locationBeforeTransitions: {
					query
				}
			}
		} = currentState)
	} catch (ex) {
		isInitialLoad = true
	}

	let nextUsfm = `${nextBook}.${nextChapter}`
	if (!nextVersion) { nextVersion = currentVersion || cookie.load('version') || '1' }
	if (!nextChapter) {
		nextUsfm = (cookie.load('last_read') || 'JHN.1').split('.').slice(0, 2).join('.')
	}

	let parallelVersion
	window.location.search.replace('?', '').split('&').forEach((kvPair) => {
		const [ key, value ] = kvPair.split('=')
		if (key.toLowerCase() === 'parallel') {
			parallelVersion = parseInt(value.toString(), 10)
		}
	})

	const hasVersionChanged = isInitialLoad || (currentVersion ? (nextVersion.toString() !== currentVersion.toString()) : true)
	const hasChapterChanged = isInitialLoad || hasVersionChanged || (nextUsfm ? (nextUsfm.toLowerCase() !== currentUsfm.toLowerCase()) : true)
	const hasParallelVersionChanged = isInitialLoad || ('parallel' in query && !!parallelVersion && (parallelVersion !== currentParallelVersionId))

	if (!hasVersionChanged && !hasChapterChanged && !hasParallelVersionChanged && !force) {
		callback()
	} else {
    // Load data
		store.dispatch(
			BibleActionCreator.readerLoad({
				isInitialLoad,
				hasVersionChanged: hasVersionChanged || force,
				hasChapterChanged: hasChapterChanged || force,
				hasParallelVersionChanged: hasParallelVersionChanged || force,
				language_tag: window.__LOCALE__.locale3,
				version: nextVersion,
				reference: nextUsfm,
				params: nextState.params,
				parallelVersion,
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

function setupReference(nextState, replace, callback) {
	const { params: { splat, version } } = nextState
	const { isVerse, isChapter } = isVerseOrChapter(splat)

	if (isChapter) {
		const newNextState = {
			params: {
				version,
				book: splat.split('.')[0],
				chapter: splat.split('.')[1],
			}
		}
		requireChapterData(newNextState, replace, callback)
	} else if (isVerse) {
		const newNextState = {
			params: {
				version,
				book: splat.split('.')[0],
				chapter: splat.split('.')[1],
				verse: splat.split('.')[2]
			}
		}
		requireVerseData(newNextState, replace, callback)
	} else {
		const newNextState = {
			params: {
				version: 1,
				book: 'JHN',
				chapter: 1,
			}
		}
		requireChapterData(newNextState, replace, callback)
	}

}

function handleParallelVersionChange(prevState, nextState, replace, callback) {
	requireChapterData(nextState, replace, callback, true)
}

const routes = getRoutes(requireChapterData, requireVerseData, setupReference, handleParallelVersionChange)

render(
	<IntlProvider locale={window.__LOCALE__.locale} messages={window.__LOCALE__.messages}>
		<Provider store={store}>
			<Router routes={routes} history={history} onUpdate={logPageView} />
		</Provider>
	</IntlProvider>,
  document.getElementById('react-app-Bible')
)
