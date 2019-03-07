import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { addLocaleData, IntlProvider } from 'react-intl'
import createLogger from 'redux-logger'
import Snapshot from '../../features/Snapshot/components/Snapshot'
import configureStore from './store'
import defaultState from './defaultState'

let initialState = defaultState

if (typeof window !== 'undefined' && typeof window.Snapshot.__INITIAL_STATE__ !== 'undefined') {
  initialState = window.Snapshot.__INITIAL_STATE__
}

let logger = null
if (typeof window !== 'undefined' && typeof window.__ENV__ !== 'undefined' && window.__ENV__ !== 'production') {
  logger = createLogger()
}

const store = configureStore(initialState, null, logger)

addLocaleData(window.__LOCALE__.data)

render(
  <IntlProvider locale={window.__LOCALE__.locale} messages={window.__LOCALE__.messages}>
    <Provider store={store}>
      <Snapshot />
    </Provider>
  </IntlProvider>,
  document.getElementById('react-app-Snapshot')
)
