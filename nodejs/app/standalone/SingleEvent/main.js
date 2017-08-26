import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store'
import defaultState from './defaultState'
import createLogger from 'redux-logger'
import EventView from '../../containers/EventView'
import { addLocaleData, IntlProvider } from 'react-intl'
import moment from 'moment'

import '../../less/style.less'

require('moment/min/locales')

let initialState = defaultState

if (typeof window !== 'undefined' && typeof window.SingleEvent.__INITIAL_STATE__ !== 'undefined') {
	initialState = window.SingleEvent.__INITIAL_STATE__
}

let logger = null
if (typeof window !== 'undefined' && typeof window.__ENV__ !== 'undefined' && window.__ENV__ !== 'production') {
	logger = createLogger()
}

const store = configureStore(initialState, null, logger)

addLocaleData(window.__LOCALE__.data)
moment.locale(window.__LOCALE__.locale)

console.log('LOCALE', window.__LOCALE__.locale2, window.__LOCALE__.locale)
render(
	<IntlProvider locale={window.__LOCALE__.locale2 === 'mn' ? window.__LOCALE__.locale2 : window.__LOCALE__.locale} messages={window.__LOCALE__.messages}>
		<Provider store={store}>
			<EventView />
		</Provider>
	</IntlProvider>,
  document.getElementById('react-app-SingleEvent')
)
