import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import bible from '@youversion/api-redux/lib/endpoints/bible/reducer'
import images from '@youversion/api-redux/lib/endpoints/images/reducer'
import readingPlans from '@youversion/api-redux/lib/endpoints/readingPlans/reducer'
import shareData from '../../widgets/ShareSheet/reducer'
import bibleReader from '../../features/Bible/reducers'

const emptyReducer = (state = {}) => { return state }

const rootReducer = combineReducers({
	auth: emptyReducer,
	bibleReader,
	eventFeeds: emptyReducer,
	content: emptyReducer,
	event: emptyReducer,
	modals: emptyReducer,
	loc: emptyReducer,
	locations: emptyReducer,
	plans: emptyReducer,
	plansDiscovery: emptyReducer,
	configuration: emptyReducer,
	references: emptyReducer,
	routing: routerReducer,
	serverLanguageTag: emptyReducer,
	altVersions: emptyReducer,
	hosts: emptyReducer,
	locale: emptyReducer,
	api: combineReducers({
		bible,
		images,
		readingPlans,
	}),
	shareData,
})

export default rootReducer
