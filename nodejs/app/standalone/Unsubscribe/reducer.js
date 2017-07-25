import { combineReducers } from 'redux'
import { routeReducer } from 'react-router-redux'
import notifications from '@youversion/api-redux/lib/endpoints/notifications/reducer'
import users from '@youversion/api-redux/lib/endpoints/users/reducer'
import readingPlans from '@youversion/api-redux/lib/endpoints/readingPlans/reducer'

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
	api: combineReducers({
		notifications,
		users,
		readingPlans
	})
})

export default rootReducer
