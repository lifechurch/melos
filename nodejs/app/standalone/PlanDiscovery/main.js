import React from 'react'
import { render } from 'react-dom'
import { Router, useRouterHistory } from 'react-router'
import { Provider } from 'react-redux'
import createLogger from 'redux-logger'
import moment from 'moment'
import { createHistory } from 'history'
import { addLocaleData, IntlProvider } from 'react-intl'
import Immutable from 'immutable'
import cookie from 'react-cookie'
import { syncHistoryWithStore } from 'react-router-redux'
import configureStore from './store'
import defaultState from './defaultState'
import getRoutes from './routes'
import PlanDiscoveryActionCreators from '../../features/PlanDiscovery/actions/creators'
import { getDefaultVersion } from '../../lib/readingPlanUtils'

import '../../less/style.less'

require('moment/min/locales')

function logPageView() {
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0)
  }
}

let initialState = defaultState

const browserHistory = useRouterHistory(createHistory)({
  basename: '/'
})

if (typeof window !== 'undefined' && typeof window.PlanDiscovery.__INITIAL_STATE__ !== 'undefined') {
  initialState = window.PlanDiscovery.__INITIAL_STATE__
}

let logger = null
if (typeof window !== 'undefined' && typeof window.__ENV__ !== 'undefined' && window.__ENV__ !== 'production') {
  logger = createLogger()
}

const store = configureStore(initialState, browserHistory, logger)
const history = syncHistoryWithStore(browserHistory, store)

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
    store.dispatch(PlanDiscoveryActionCreators.discoverAll({ language_tag: window.__LOCALE__.planLocale }, store.getState().auth.isLoggedIn)).then(() => {
      callback()
    }, () => {
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
  const idNum = parseInt(params.id.toString().split('-')[0], 10)
  const currentState = store.getState()

  // Do we already have data from server?
  if (currentState && currentState.plansDiscovery && currentState.plansDiscovery.collection && currentState.plansDiscovery.collection.id === idNum && currentState.plansDiscovery.collection.items && currentState.plansDiscovery.collection.items.length) {
    callback()
  } else if (params.id && idNum > 0) {
    store.dispatch(PlanDiscoveryActionCreators.collectionAll({ id: idNum })).then(() => {
      callback()
    }, () => {
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
  const currentState = store.getState()

  // Do we already have data from server?
  if (currentState && currentState.plansDiscovery && currentState.plansDiscovery.collection && currentState.plansDiscovery.collection.context === 'saved' && currentState.plansDiscovery.collection.items && currentState.plansDiscovery.collection.items.length) {
    callback()
  } else {
    store.dispatch(PlanDiscoveryActionCreators.savedPlanInfo({ context: 'saved' }, store.getState().auth.isLoggedIn)).then(() => {
      callback()
    }, () => {
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
  const idNum = params.id ? parseInt(params.id.toString().split('-')[0], 10) : 0

  // Do we already have data from server?
  if (currentState && currentState.plansDiscovery && currentState.plansDiscovery.collection && currentState.plansDiscovery.collection.context === 'recommended' && currentState.plansDiscovery.collection.id === idNum && currentState.plansDiscovery.collection.items && currentState.plansDiscovery.collection.items.length) {
    callback()
  } else if (idNum > 0) {
    store.dispatch(PlanDiscoveryActionCreators.recommendedPlansInfo({ context: 'recommended', id: idNum, language_tag: window.__LOCALE__.planLocale }, store.getState().auth.isLoggedIn)).then(() => {
      callback()
    }, () => {
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
  const idNum = parseInt(params.id.toString().split('-')[0], 10)
  const currentState = store.getState()
  const isLoggedIn = currentState.auth.isLoggedIn

  let getPlanView = true
  let getStats = true
  let getSavedPlans = true
  let getRecommendedPlans = true

  if (currentState && currentState.plansDiscovery && currentState.plansDiscovery.plans && currentState.plansDiscovery.plans.id === idNum) {
    getPlanView = false
    if (currentState.plansDiscovery.plans.stats) {
      getStats = false
    }
  }
  if (currentState.readingPlans.recommendedPlans[idNum]) {
    getRecommendedPlans = false
  }
  if (!isLoggedIn || currentState.readingPlans.savedPlans.items) {
    getSavedPlans = false
  }

  if (!getPlanView && !getStats && !getRecommendedPlans && !getSavedPlans) {
    callback()
  } else {
    store.dispatch(PlanDiscoveryActionCreators.readingplanInfo({
      getPlanView,
      getStats,
      getRecommendedPlans,
      getSavedPlans,
      id: idNum,
      language_tag: window.__LOCALE__.planLocale
    }, isLoggedIn))
    .then(() => {
      callback()
    }, () => {
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
function requireSubscribedPlans(nextState, replace, callback) {
  const currentState = store.getState()
  const { auth: { userData: { userid } }, readingPlans: { subscribedPlans: { items } } } = currentState

  if (Array.isArray(items)) {
    callback()
  } else {
    store.dispatch(PlanDiscoveryActionCreators.items({ user_id: userid, page: 1 }, true)).then(() => {
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
    store.dispatch(PlanDiscoveryActionCreators.savedItems({ page: 1 }, true)).then(() => {
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
    store.dispatch(PlanDiscoveryActionCreators.completed({ user_id: userid, page: 1 }, true)).then(() => {
      callback()
    })
  }
}

function requireSamplePlan(nextState, replace, callback) {

  const currentState = store.getState()
  const version = cookie.load('version') || '1'
  const { auth: { isLoggedIn }, readingPlans: { fullPlans } } = currentState
  const imFullPlans = Immutable.fromJS(fullPlans)
  let { params: { id, day } } = nextState

  id = id.toString().split('-')[0]
  day = day ? parseInt(day.toString(), 10) : 1
  if (typeof fullPlans === 'object'
    && imFullPlans.hasIn([id, 'calendar', day - 1, 'hasReferences'])) {
    store.dispatch(PlanDiscoveryActionCreators.planSelect({ id }))
    callback()
  } else if (imFullPlans.hasIn([id, 'calendar', day - 1, 'references'])) {
    const references = imFullPlans.getIn([id, 'calendar', day - 1, 'references' ]).toJS()
    store.dispatch(PlanDiscoveryActionCreators.planReferences({ references, version, id, currentDay: day })).then(() => {
      store.dispatch(PlanDiscoveryActionCreators.planSelect({ id }))
      callback()
    }, (error) => {
      const defaultVersion = getDefaultVersion(store, window.__LOCALE__.planLocale)
      store.dispatch(PlanDiscoveryActionCreators.planReferences({ references, version: defaultVersion, id, currentDay: day })).then((refd) => {
        store.dispatch(PlanDiscoveryActionCreators.planSelect({ id }))
        callback()
      }, (error) => { callback() })
    })
  } else {
    store.dispatch(PlanDiscoveryActionCreators.sampleAll({ id, language_tag: window.__LOCALE__.planLocale, version, day }, isLoggedIn)).then(() => {
      callback()
    }, (err) => {
      const defaultVersion = getDefaultVersion(store, window.__LOCALE__.planLocale)
      store.dispatch(PlanDiscoveryActionCreators.sampleAll({ id, language_tag: window.__LOCALE__.planLocale, version: defaultVersion, day }, isLoggedIn)).then(() => {
        callback()
      }, (err) => { callback() })
    })
  }
}

function requirePlanCompleteData(nextState, replace, callback) {
  const currentState = store.getState()
  const { params } = nextState
  const {
    readingPlans: { fullPlans, recommendedPlans, savedPlans }
  } = currentState
  const id = parseInt(params.id.toString().split('-')[0], 10)

  let getPlanView = true
  let getSavedPlans = true
  let getRecommendedPlans = true

  if (typeof fullPlans === 'object' && typeof fullPlans[id] !== 'undefined') {
    getPlanView = false
  }
  if (typeof recommendedPlans === 'object' &&
    typeof recommendedPlans[id] !== 'undefined' &&
    typeof recommendedPlans[id].items !== 'undefined' &&
    recommendedPlans[id].items.length > 0
  ) {
    getRecommendedPlans = false
  }
  if (
    (
      typeof savedPlans === 'object' &&
      typeof savedPlans.items !== 'undefined' &&
      savedPlans.items.length > 0
    ) ||
    (
      typeof savedPlans === 'object' &&
      typeof savedPlans.all !== 'undefined' &&
      savedPlans.all.length > 0
    )
  ) {
    getSavedPlans = false
  }

  store.dispatch(PlanDiscoveryActionCreators.planComplete({
    id,
    language_tag: window.__LOCALE__.planLocale,
    getPlanView,
    getSavedPlans,
    getRecommendedPlans,
  }, true)).then(() => {
    callback()
  })
}

function requirePlanView(nextState, replace, callback) {
  const currentState = store.getState()
  const { params } = nextState
  const { auth: { userData: { userid } }, readingPlans: { fullPlans } } = currentState
  const id = parseInt(params.id.toString().split('-')[0], 10)
// && 'subscription_id' in fullPlans[id]
  if (typeof fullPlans === 'object' && typeof fullPlans[id] !== 'undefined') {
    callback()
  } else {
    store.dispatch(PlanDiscoveryActionCreators.readingplanView({
      id,
      language_tag: window.__LOCALE__.planLocale,
      user_id: userid
    }, true)).then(() => {
      callback()
    })
  }
}


const routes = getRoutes(
  requirePlanDiscoveryData,
  requirePlanCollectionData,
  requirePlanData,
  requireSavedPlanData,
  requireRecommendedPlanData,
  requireSubscribedPlans,
  requireSavedPlans,
  requireCompletedPlans,
  requirePlanCompleteData,
  requirePlanView,
  requireSamplePlan
)

render(
  <IntlProvider locale={window.__LOCALE__.locale2 === 'mn' ? window.__LOCALE__.locale2 : window.__LOCALE__.locale} messages={window.__LOCALE__.messages}>
    <Provider store={store}>
      <Router routes={routes} history={history} onUpdate={logPageView} />
    </Provider>
  </IntlProvider>,
  document.getElementById('react-app-PlanDiscovery')
)
