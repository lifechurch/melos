import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { offline } from '@redux-offline/redux-offline'
import offlineConfig from '@redux-offline/redux-offline/lib/defaults'
import { routerMiddleware } from 'react-router-redux'
import rootReducer from './reducer'
import youversionApi from '../../middleware/youversionApi'
import youversionAuth from '../../middleware/youversionAuth'


export default function configureStore(initialState, history, logger) {
	const reduxRouterMiddleware = routerMiddleware(history)
	let finalCreateStore = null
	if (logger !== null) {
		finalCreateStore = compose(
			applyMiddleware(thunk, youversionApi, youversionAuth, reduxRouterMiddleware, logger),
			offline(offlineConfig)
		)(createStore)
	} else {
		finalCreateStore = compose(
			applyMiddleware(thunk, youversionApi, youversionAuth, reduxRouterMiddleware),
			offline(offlineConfig)
		)(createStore)
	}

	return finalCreateStore(rootReducer, initialState)
}
