import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import bibleReader from '../../features/Bible/reducers'
import passage from '../../features/Passage/reducers'

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
	passage
})

export default rootReducer
