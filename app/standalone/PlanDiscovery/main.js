import React from 'react'
import { render } from 'react-dom'
import { Router, useRouterHistory } from 'react-router'
import { Provider } from 'react-redux'
import configureStore from './store'
import defaultState from './defaultState'
import createLogger from 'redux-logger'
import { addLocaleData, IntlProvider } from 'react-intl'
import moment from 'moment'
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


/**
 * { function_description }
 *
 * @param      {<type>}    nextState  The next state
 * @param      {<type>}    replace    The replace
 * @param      {Function}  callback   The callback
 */
function requirePlanDiscoveryData(nextState, replace, callback) {
	const currentState = store.getState()

	if (currentState && currentState.plansDiscovery && currentState.plansDiscovery.items && currentState.plansDiscovery.items.length) {
		callback()
	} else {
		store.dispatch(PlanDiscoveryActionCreators.discoverAll({ language_tag: window.__LOCALE__.planLocale }, store.getState().auth.isLoggedIn)).then((event) => {
			callback()
		}, (error) => {
			callback()
		})
	}
}

/**
 * { function_description }
 *
 * @param      {<type>}    nextState  The next state
 * @param      {<type>}    replace    The replace
 * @param      {Function}  callback   The callback
 */
function requirePlanCollectionData(nextState, replace, callback) {
	const { params } = nextState
	var idNum = parseInt(params.id.toString().split("-")[0])
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

/**
 * { function_description }
 *
 * @param      {<type>}    nextState  The next state
 * @param      {<type>}    replace    The replace
 * @param      {Function}  callback   The callback
 */
function requireSavedPlanData(nextState, replace, callback) {
	const { params } = nextState
	const currentState = store.getState()

	// Do we already have data from server?
	if (currentState && currentState.plansDiscovery && currentState.plansDiscovery.collection && currentState.plansDiscovery.collection.context == 'saved' && currentState.plansDiscovery.collection.items && currentState.plansDiscovery.collection.items.length) {
		callback()
	} else {
		store.dispatch(PlanDiscoveryActionCreators.savedPlanInfo({ context: 'saved' }, store.getState().auth.isLoggedIn)).then((event) => {
			callback()
		}, (error) => {
			callback()
		})
	}
}

/**
 * { function_description }
 *
 * @param      {<type>}    nextState  The next state
 * @param      {<type>}    replace    The replace
 * @param      {Function}  callback   The callback
 */
function requireRecommendedPlanData(nextState, replace, callback) {
	const { params } = nextState
	const currentState = store.getState()
	const idNum = params.hasOwnProperty('id') ? parseInt(params.id.toString().split("-")[0]) : 0

	// Do we already have data from server?
	if (currentState && currentState.plansDiscovery && currentState.plansDiscovery.collection && currentState.plansDiscovery.collection.context == 'recommended' && currentState.plansDiscovery.collection.id === idNum && currentState.plansDiscovery.collection.items && currentState.plansDiscovery.collection.items.length) {
		callback()
	} else if (idNum > 0) {
		store.dispatch(PlanDiscoveryActionCreators.recommendedPlansInfo({ context: 'recommended', id: idNum, language_tag: window.__LOCALE__.planLocale }, store.getState().auth.isLoggedIn)).then((event) => {
			callback()
		}, (error) => {
			callback()
		})
	} else {
		callback()
	}
}

/**
 * { function_description }
 *
 * @param      {<type>}    nextState  The next state
 * @param      {<type>}    replace    The replace
 * @param      {Function}  callback   The callback
 */
function requirePlanData(nextState, replace, callback) {
	const { params } = nextState
	var idNum = parseInt(params.id.toString().split("-")[0])
	const currentState = store.getState()
	if (currentState && currentState.plansDiscovery && currentState.plansDiscovery.plans && currentState.plansDiscovery.plans.id === idNum) {
		callback()
	} else if (idNum > 0) {
		store.dispatch(PlanDiscoveryActionCreators.readingplanInfo({ id: idNum, language_tag: window.__LOCALE__.planLocale }, store.getState().auth.isLoggedIn)).then((event) => {
			callback()
		}, (error) => {
			callback()
		})
	} else {
		callback()
	}
}

/**
 * { function_description }
 *
 * @param      {<type>}    nextState  The next state
 * @param      {<type>}    replace    The replace
 * @param      {Function}  callback   The callback
 */
function requireSubscribedPlans(nextState, replace, callback) {
	const currentState = store.getState()
	const { auth: { userData: { userid } }, readingPlans: { subscribedPlans: { items } } } = currentState

	if (Array.isArray(items)) {
		callback()
	} else {
		store.dispatch(PlanDiscoveryActionCreators.items({ user_id: userid, page: 1 }, true)).then((d) => {
			callback()
		})
	}
}

/**
 * { function_description }
 *
 * @param      {<type>}    nextState  The next state
 * @param      {<type>}    replace    The replace
 * @param      {Function}  callback   The callback
 */
function requireSavedPlans(nextState, replace, callback) {
	const currentState = store.getState()
	const { readingPlans: { savedPlans: { items } } } = currentState

	if (Array.isArray(items)) {
		callback()
	} else {
		store.dispatch(PlanDiscoveryActionCreators.savedItems({ page: 1 }, true)).then((d) => {
			callback()
		})
	}
}

/**
 * { function_description }
 *
 * @param      {<type>}    nextState  The next state
 * @param      {<type>}    replace    The replace
 * @param      {Function}  callback   The callback
 */
function requireCompletedPlans(nextState, replace, callback) {
	const currentState = store.getState()
	const { auth: { userData: { userid } }, readingPlans: { completedPlans: { items } } } = currentState

	if (Array.isArray(items)) {
		callback()
	} else {
		store.dispatch(PlanDiscoveryActionCreators.completed({ user_id: userid, page: 1 }, true)).then((d) => {
			callback()
		})
	}
}

const routes = getRoutes(requirePlanDiscoveryData, requirePlanCollectionData, requirePlanData, requireSavedPlanData, requireRecommendedPlanData, requireSubscribedPlans, requireSavedPlans, requireCompletedPlans)

render(
	<IntlProvider locale={window.__LOCALE__.locale2 == "mn" ? window.__LOCALE__.locale2 : window.__LOCALE__.locale} messages={window.__LOCALE__.messages}>
		<Provider store={store}>
			<Router routes={routes} history={browserHistory} onUpdate={() => window.scrollTo(0, 0)} />
		</Provider>
	</IntlProvider>,
  document.getElementById('react-app')
)