import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import createLogger from 'redux-logger'
import youversionApi from '../middleware/youversionApi'
import googleMapsApi from '../middleware/googleMapsApi'
import { syncHistory } from 'redux-simple-router'
import { createHistory } from 'history'

const history = createHistory()
const logger = createLogger()
const reduxRouterMiddleware = syncHistory(history)

const finalCreateStore = compose(
  applyMiddleware(thunk, youversionApi, googleMapsApi, reduxRouterMiddleware, logger)
)(createStore)

export default function configureStore(initialState) {
	const store = finalCreateStore(rootReducer, initialState)
	return {
		store,
		history
	}
}