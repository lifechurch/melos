import React from 'react'
import { render } from 'react-dom'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import configureStore from './store'
import defaultState from './defaultState'
import createLogger from 'redux-logger'
import { addLocaleData, IntlProvider } from 'react-intl'
// import moment from 'moment'
import { useRouterHistory } from 'react-router'
import { createHistory } from 'history'
import getRoutes from './routes'
import cookie from 'react-cookie';
import BibleActionCreator from '../../features/Bible/actions/creators'
import PassageActionCreator from '../../features/Passage/actions/creators'

// require('moment/min/locales')

let initialState = defaultState

let browserHistory = useRouterHistory(createHistory)({
	basename: '/'
})

if (typeof window !== 'undefined' && typeof window.__INITIAL_STATE__ !== 'undefined') {
	initialState = window.__INITIAL_STATE__
}

let logger = null
if (typeof window !== 'undefined' && typeof window.__ENV__ !== 'undefined' && window.__ENV__ !== 'production') {
	logger = createLogger()
}

const store = configureStore(initialState, null, logger)
addLocaleData(window.__LOCALE__.data)
// moment.locale(window.__LOCALE__.locale)


function requireChapterData(nextState, replace, callback) {
	const { params: { lang:routeLang, version:routeVersion, book, chapter, verse, vabbr } } = nextState
	const currentState = store.getState()
	// let lang = params.lang || cookie.load('locale') || Locale.locale
	let lang = window.__LOCALE__.locale3
	let version = routeVersion || cookie.load('version') || '1'
	let reference = `${book.toUpperCase()}.${chapter}` || cookie.load('last_read') || 'MAT.1'

	if (currentState && currentState.bibleReader && currentState.bibleReader.chapter && currentState.bibleReader.chapter.reference && currentState.bibleReader.chapter.reference.usfm == reference) {
		callback()
	} else if (version > 0 && reference) {
		store.dispatch(BibleActionCreator.readerLoad({ language_tag: lang, version: version, reference: reference }, store.getState().auth.isLoggedIn)).then(() => {
			callback()
		}, (error) => {
			callback()
		})
	} else {
		callback()
	}
}

function requireVerseData(nextState, replace, callback) {
	const { params: { lang:routeLang, version:routeVersion, book, chapter, verse, vabbr } } = nextState
	const currentState = store.getState()

	let lang = window.__LOCALE__.planLocale
	let reference = `${book.toUpperCase()}.${chapter}.${verse}`
	let versions = [ parseInt(routeVersion), ...currentState.altVersions[currentState.serverLanguageTag].text ]
	let isLoggedIn = currentState.auth.isLoggedIn
	if (currentState && currentState.passage && currentState.passage.verses && currentState.passage.verses.versions && currentState.passage.verses.versions.length && currentState.passage.verses.versions[0] == routeVersion && currentState.passage.verses.current_verse == reference) {
		callback()
	} else if (versions.length > 0 && reference) {
		store.dispatch(PassageActionCreator.passageLoad({ language_tag: lang , versions: versions, passage: reference }, isLoggedIn)).then(() => {
			callback()
		}, (error) => {
			callback()
		})
	} else {
		callback()
	}
}

const routes = getRoutes(requireChapterData, requireVerseData)

render(
	<IntlProvider locale={window.__LOCALE__.locale} messages={window.__LOCALE__.messages}>
		<Provider store={store}>
			<Router routes={routes} history={browserHistory} onUpdate={() => window.scrollTo(0, 0)} />
		</Provider>
	</IntlProvider>,
  document.getElementById('react-app')
)