import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducer'
import youversionApi from '../../middleware/youversionApi'
import youversionAuth from '../../middleware/youversionAuth'

export default function configureStore(initialState, history, logger) {
	let finalCreateStore = null

	if (logger !== null) {
		finalCreateStore = compose(
		  applyMiddleware(thunk, youversionApi, youversionAuth, logger)
		)(createStore)
	} else {
		finalCreateStore = compose(
		  applyMiddleware(thunk, youversionApi, youversionAuth)
		)(createStore)
	}

	return finalCreateStore(rootReducer, initialState)
}