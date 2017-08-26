import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import createLogger from 'redux-logger'
import { addLocaleData, IntlProvider } from 'react-intl'
import configureStore from './store'
import defaultState from './defaultState'
import PasswordChange from '../../features/PasswordChange/components/PasswordChange'
import '../../less/style.less'

let initialState = defaultState

if (typeof window !== 'undefined' && typeof window.PasswordChange.__INITIAL_STATE__ !== 'undefined') {
	initialState = window.PasswordChange.__INITIAL_STATE__
}

let logger = null
if (typeof window !== 'undefined' && typeof window.__ENV__ !== 'undefined' && window.__ENV__ !== 'production') {
	logger = createLogger()
}

const store = configureStore(initialState, null, logger)

render(
	<IntlProvider locale={window.__LOCALE__.locale2 == 'mn' ? window.__LOCALE__.locale2 : window.__LOCALE__.locale} messages={window.__LOCALE__.messages}>
		<Provider store={store}>
			<PasswordChange />
		</Provider>
	</IntlProvider>,
  document.getElementById('react-app-PasswordChange')
)
