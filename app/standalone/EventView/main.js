import 'babel-polyfill'
import React from 'react'
import { Router } from 'react-router'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from '../../store/configureStore'
import { browserHistory } from 'react-router'
import createLogger from 'redux-logger'
import getRoutes from './routes'
import defaultState from '../../defaultState'
import EventActionCreators from '../../features/EventEdit/features/details/actions/creators'

let initialState = defaultState

if (typeof window !== 'undefined' && typeof window.__INITIAL_STATE__ !== 'undefined') {
	initialState = window.__INITIAL_STATE__
}

let logger = null
if (typeof window !== 'undefined' && typeof window.__ENV__ !== 'undefined' && window.__ENV__ !== 'production') {
	logger = createLogger()
}

const store = configureStore(initialState, browserHistory, logger)

function requireEvent(nextState, replace, callback) {
	const { params } = nextState
	if (params.hasOwnProperty("id") && params.id > 0) {
		store.dispatch(EventActionCreators.view(nextState.params.id)).then((event) => {
			callback()
		}, (error) => {
			callback()
		})
	} else {
		callback()
	}
}

const routes = getRoutes(() => {}, requireEvent)

render(
	<Provider store={store}>
		<Router routes={routes} history={browserHistory} />
	</Provider>,
  document.getElementById('react-app')
)
