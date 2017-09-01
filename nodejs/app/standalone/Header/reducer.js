import { combineReducers } from 'redux'
import notifications from '@youversion/api-redux/lib/endpoints/notifications/reducer'
import friendships from '@youversion/api-redux/lib/endpoints/friendships/reducer'
import users from '@youversion/api-redux/lib/endpoints/users/reducer'

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
	api: combineReducers({
		notifications,
		friendships,
		users
	})
})

export default rootReducer
