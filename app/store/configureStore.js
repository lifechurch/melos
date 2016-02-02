import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import youversionApi from '../middleware/youversionApi'
import googleMapsApi from '../middleware/googleMapsApi'
import { syncHistory } from 'react-router-redux'

export default function configureStore(initialState, history, logger) {
	const reduxRouterMiddleware = syncHistory(history)

	const finalCreateStore = compose(
	  applyMiddleware(thunk, youversionApi, googleMapsApi, reduxRouterMiddleware, logger)
	)(createStore)

	return finalCreateStore(rootReducer, initialState)
}