import { combineReducers } from 'redux'
import { routeReducer } from 'react-router-redux'
import bible from '@youversion/api-redux/lib/endpoints/bible/reducer'

const emptyReducer = (state = {}) => { return state }

const rootReducer = combineReducers({
	auth: emptyReducer,
	bibleReader: emptyReducer,
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
	routing: routeReducer,
	serverLanguageTag: emptyReducer,
	altVersions: emptyReducer,
	hosts: emptyReducer,
	passage: emptyReducer,
	locale: emptyReducer,
	api: combineReducers({
		bible
	})
})

export default rootReducer
