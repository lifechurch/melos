import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import youversionApi from '../middleware/youversionApi'
import googleMapsApi from '../middleware/googleMapsApi'
import youversionAuth from '../middleware/youversionAuth'
import { syncHistory } from 'react-router-redux'

export default function configureStore(initialState, history, logger) {
	const reduxRouterMiddleware = syncHistory(history)

	let finalCreateStore = null

	if (logger !== null) {
		finalCreateStore = compose(
		  applyMiddleware(thunk, youversionApi, googleMapsApi, youversionAuth, reduxRouterMiddleware, logger)
		)(createStore)
	} else {
		finalCreateStore = compose(
		  applyMiddleware(thunk, youversionApi, googleMapsApi, youversionAuth, reduxRouterMiddleware)
		)(createStore)
	}

	return finalCreateStore(rootReducer, initialState)
}