import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import Root from './containers/Root'
import configureStore from './store/configureStore'
import defaultState from './defaultState'

const { store, history } = configureStore(defaultState)

render(
  <Root store={store} history={history} />,
  document.getElementById('react-app')
)