import { combineReducers } from 'redux'
import notifications from '@youversion/api-redux/lib/endpoints/notifications/reducer'
import localization from '@youversion/api-redux/lib/endpoints/localization'

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
	routing: emptyReducer,
	serverLanguageTag: emptyReducer,
	altVersions: emptyReducer,
	hosts: emptyReducer,
	passage: emptyReducer,
	locale: emptyReducer,
	localization: combineReducers(localization.reducers),
	api: combineReducers({
		notifications,
	})
})

export default rootReducer
