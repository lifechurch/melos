import 'babel-polyfill'
import React from 'react'
import { Router, browserHistory } from 'react-router'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import createLogger from 'redux-logger'
import { addLocaleData, IntlProvider } from 'react-intl'
import moment from 'moment'
import { syncHistoryWithStore } from 'react-router-redux'
import getRoutes from './routes'
import defaultState from './defaultState'
import EventActionCreators from './features/EventEdit/features/details/actions/creators'
import PlanDiscoveryActionCreators from './features/PlanDiscovery/actions/creators'
import configureStore from './store/configureStore'
import './less/style.less'

require('moment/min/locales')

let initialState = defaultState

if (typeof window !== 'undefined' && typeof window.__INITIAL_STATE__ !== 'undefined') {
  initialState = window.__INITIAL_STATE__
}

let logger = null
if (typeof window !== 'undefined' && typeof window.__ENV__ !== 'undefined' && window.__ENV__ !== 'production') {
  logger = createLogger()
}

export const store = configureStore(initialState, browserHistory, logger)
const history = syncHistoryWithStore(browserHistory, store)

function requireAuth(nextState, replace) {
  const state = store.getState()
  if (!state.auth.isLoggedIn && nextState.location.pathname !== `/${window.__LOCALE__.locale}/login`) {
    replace({
      pathname: `/${window.__LOCALE__.locale}/login`,
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function requireEvent(nextState, replace, callback) {
  const { params } = nextState
  if (params.hasOwnProperty('id') && params.id > 0) {
    store.dispatch(EventActionCreators.view(params.id, store.getState().auth.isLoggedIn)).then((event) => {
      callback()
    }, (error) => {
      callback()
    })
  } else {
    store.dispatch(EventActionCreators.new())
    callback()
  }
}

function requirePlanDiscoveryData(nextState, replace, callback) {
  store.dispatch(PlanDiscoveryActionCreators.discoverAll({ language_tag: window.__LOCALE__.locale2 }, store.getState().auth.isLoggedIn)).then((event) => {
    callback()
  }, (error) => {
    callback()
  })
}

function requirePlanCollectionData(nextState, replace, callback) {
  const { params } = nextState
  if (params.hasOwnProperty('id') && params.id > 0) {
    store.dispatch(PlanDiscoveryActionCreators.collectionAll({ id: params.id }, store.getState().auth.isLoggedIn)).then((event) => {
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
  const idNum = params.id.split('-')
  if (params.hasOwnProperty('id') && idNum[0] > 0) {
    store.dispatch(PlanDiscoveryActionCreators.readingplanInfo({ id: idNum[0], language_tag: window.__LOCALE__.locale2, user_id: store.getState().auth.userData.userid }, store.getState().auth.isLoggedIn)).then((event) => {
      callback()
    }, (error) => {
      callback()
    })
  } else {
    callback()
  }
}

const routes = getRoutes(requireAuth, requireEvent, requirePlanDiscoveryData, requirePlanCollectionData, requirePlanData)
addLocaleData(window.__LOCALE__.data)
moment.locale(window.__LOCALE__.momentLocale)
window.__LOCALE__.momentLocaleData = moment.localeData()

render(
  <IntlProvider locale={window.__LOCALE__.locale2 == 'mn' ? window.__LOCALE__.locale2 : window.__LOCALE__.locale} messages={window.__LOCALE__.messages}>
    <Provider store={store}>
      <Router routes={routes} history={history} />
    </Provider>
  </IntlProvider>,
	document.getElementById('react-app')
)
