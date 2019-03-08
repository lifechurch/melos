import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { addLocaleData, IntlProvider } from 'react-intl'
import createLogger from 'redux-logger'
import Footer from '../../features/Footer/components/Footer'
import configureStore from './store'


import defaultState from './defaultState'

let initialState = defaultState

if (typeof window !== 'undefined' && typeof window.Footer.__INITIAL_STATE__ !== 'undefined') {
  initialState = window.Footer.__INITIAL_STATE__
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
      <Footer />
    </Provider>
  </IntlProvider>,
  document.getElementById('react-app-Footer')
)
