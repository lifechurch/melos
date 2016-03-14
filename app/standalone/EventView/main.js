import React from 'react'
import { Router } from 'react-router'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from '../../store/configureStore'
import { browserHistory } from 'react-router'
import createLogger from 'redux-logger'
import getRoutes from './routes'
import defaultState from '../../defaultState'

let initialState = defaultState

if (typeof window !== 'undefined' && typeof window.__INITIAL_STATE__ !== 'undefined') {
	initialState = window.__INITIAL_STATE__
}

let logger = null
if (typeof window !== 'undefined' && typeof window.__ENV__ !== 'undefined' && window.__ENV__ !== 'production') {
	logger = createLogger()
}

const store = configureStore(initialState, browserHistory, logger)
const routes = getRoutes(() => {})

render(
	<Provider store={store}>
		<Router routes={routes} history={browserHistory} />
	</Provider>,
  document.getElementById('react-app')
)
