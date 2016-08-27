import React from 'react'
import { render } from 'react-dom'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import configureStore from './store'
import defaultState from './defaultState'
import createLogger from 'redux-logger'
import { addLocaleData, IntlProvider } from 'react-intl'
import moment from 'moment'
import { useRouterHistory } from 'react-router'
import { createHistory } from 'history'
import getRoutes from './routes'
import PlanDiscoveryActionCreators from '../../features/PlanDiscovery/actions/creators'

require('moment/min/locales')

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
moment.locale(window.__LOCALE__.locale)

function requirePlanDiscoveryData(nextState, replace, callback) {
	const currentState = store.getState()

	if (currentState && currentState.plansDiscovery && currentState.plansDiscovery.items && currentState.plansDiscovery.items.length) {
		callback()
	} else {
		store.dispatch(PlanDiscoveryActionCreators.discoverAll({ language_tag: 'en' }, store.getState().auth.isLoggedIn)).then((event) => {
			callback()
		}, (error) => {
			callback()
		})
	}
}

function requirePlanCollectionData(nextState, replace, callback) {
	const { params } = nextState
	var idNum = parseInt(params.id.split("-")[0])
	const currentState = store.getState()

	// Do we already have data from server?
	if (currentState && currentState.plansDiscovery && currentState.plansDiscovery.collection && currentState.plansDiscovery.collection.id === idNum && currentState.plansDiscovery.collection.items && currentState.plansDiscovery.collection.items.length) {
		callback()
	} else if (params.hasOwnProperty("id") && idNum > 0) {
		store.dispatch(PlanDiscoveryActionCreators.collectionAll({ id: idNum })).then((event) => {
			callback()
		}, (error) => {
			callback()
		})
	} else {
		callback()
	}
}

function requirePlanData(nextState, replace, callback) {
	const { params } = nextState
	var idNum = parseInt(params.id.split("-")[0])
	const currentState = store.getState()
	if (currentState && currentState.plansDiscovery && currentState.plansDiscovery.plans && currentState.plansDiscovery.plans.id === idNum) {
		callback()
	} else if (idNum > 0) {
		store.dispatch(PlanDiscoveryActionCreators.readingplanInfo({ id: idNum, language_tag: window.__LOCALE__.locale2, user_id: store.getState().auth.userData.userid }, store.getState().auth.isLoggedIn)).then((event) => {
			callback()
		}, (error) => {
			callback()
		})
	} else {
		callback()
	}
}

const routes = getRoutes(requirePlanDiscoveryData, requirePlanCollectionData, requirePlanData)

render(
	<IntlProvider locale={window.__LOCALE__.locale} messages={window.__LOCALE__.messages}>
		<Provider store={store}>
			<Router routes={routes} history={browserHistory} onUpdate={() => window.scrollTo(0, 0)} />
		</Provider>
	</IntlProvider>,
  document.getElementById('react-app')
)