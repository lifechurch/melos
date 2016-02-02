import 'babel-polyfill'
import React from 'react'
import { Router } from 'react-router'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
import defaultState from './defaultState'
import { browserHistory } from 'react-router'
import createLogger from 'redux-logger'
import routes from './routes'

const logger = createLogger()
const store = configureStore(defaultState, browserHistory, logger)

render(
	<Provider store={store}>
		<Router routes={routes} history={browserHistory} />
	</Provider>,
  document.getElementById('react-app')
)