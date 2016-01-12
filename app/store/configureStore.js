import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import createLogger from 'redux-logger'

const logger = createLogger()

const finalCreateStore = compose(
  applyMiddleware(thunk, logger)
)(createStore)

export default function configureStore(initialState) {
	return finalCreateStore(rootReducer, initialState)
}