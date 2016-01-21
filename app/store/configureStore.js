import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import createLogger from 'redux-logger'
import youversionApi from '../middleware/youversionApi'
import googleMapsApi from '../middleware/googleMapsApi'

const logger = createLogger()

const finalCreateStore = compose(
  applyMiddleware(youversionApi, googleMapsApi, thunk, logger)
)(createStore)

export default function configureStore(initialState) {
	return finalCreateStore(rootReducer, initialState)
}