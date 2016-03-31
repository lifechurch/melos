import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store'
import defaultState from './defaultState'
import createLogger from 'redux-logger'
import EventView from '../../containers/EventView'

let initialState = defaultState

if (typeof window !== 'undefined' && typeof window.__INITIAL_STATE__ !== 'undefined') {
	initialState = window.__INITIAL_STATE__
}

let logger = null
if (typeof window !== 'undefined' && typeof window.__ENV__ !== 'undefined' && window.__ENV__ !== 'production') {
	logger = createLogger()
}

const store = configureStore(initialState, null, logger)

render(
	<Provider store={store}>
		<EventView />
	</Provider>,
  document.getElementById('react-app')
)