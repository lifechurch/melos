import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import youversionAuth from '@youversion/api-redux/lib/middleware/youversionAuth'
import rootReducer from './reducer'
import youversionApi from '../../middleware/youversionApi'


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
