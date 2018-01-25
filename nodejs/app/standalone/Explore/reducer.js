import { combineReducers } from 'redux'
import moments from '@youversion/api-redux/lib/endpoints/moments/reducer'
import bible from '@youversion/api-redux/lib/endpoints/bible/reducer'
import images from '@youversion/api-redux/lib/endpoints/images/reducer'
import readingPlans from '@youversion/api-redux/lib/endpoints/readingPlans/reducer'
import notifications from '@youversion/api-redux/lib/endpoints/notifications/reducer'
import friendships from '@youversion/api-redux/lib/endpoints/friendships/reducer'
import users from '@youversion/api-redux/lib/endpoints/users/reducer'
import search from '@youversion/api-redux/lib/endpoints/search/reducer'
import exploreApi from '@youversion/api-redux/lib/endpoints/explore'
import shareData from '../../widgets/ShareSheet/reducer'

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
		moments,
		bible,
		images,
		readingPlans,
		notifications,
		friendships,
		users,
		search
	}),
	shareData,
	explore: combineReducers(exploreApi.reducers),
})

export default rootReducer
