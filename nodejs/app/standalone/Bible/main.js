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
import getDefaultChapter from '@youversion/utils/lib/bible/getDefaultChapter'
import isVerseOrChapter from '@youversion/utils/lib/bible/isVerseOrChapter'
import configureStore from './store'
import getRoutes from './routes'
import BibleActionCreator from '../../features/Bible/actions/creators'
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
		nextUsfm = (cookie.load('last_read') || getDefaultChapter(nextVersion)).split('.').slice(0, 2).join('.')
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
	} else if (!isVerse) {
		const newNextState = {
			params: {
				version: 1,
				book: 'JHN',
				chapter: 1,
			}
		}
		requireChapterData(newNextState, replace, callback)
	}

	callback()
}

const routes = getRoutes(requireChapterData, setupReference)

render(
	<IntlProvider locale={window.__LOCALE__.locale} messages={window.__LOCALE__.messages}>
		<Provider store={store}>
			<Router routes={routes} history={history} onUpdate={logPageView} />
		</Provider>
	</IntlProvider>,
  document.getElementById('react-app-Bible')
)
