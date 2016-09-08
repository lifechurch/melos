import { combineReducers } from 'redux'
import { routeReducer } from 'react-router-redux'
import { eventFeeds } from './eventFeeds'
import { modals } from './modals'
import auth from '../features/Auth/reducers/auth'
import loc from '../features/EventEdit/features/location/reducers/location'
import locations from '../features/EventEdit/features/location/reducers/locations'
import event from '../features/EventEdit/features/details/reducers/event'
import content from '../features/EventEdit/features/content/reducers/content'
import references from './references'
import plans from './plans'
import configuration from '../features/EventFeedMine/reducers/configuration'
import plansDiscovery from '../features/PlanDiscovery/reducers'
import saveForLater from '../features/SaveForLater/reducers'

const rootReducer = combineReducers({
	auth: auth,
	eventFeeds,
	content,
	event,
	modals,
	loc,
	locations,
	plans,
	plansDiscovery,
	saveForLater,
	configuration,
	references,
	routing: routeReducer,
	serverLanguageTag: (state = {}, action) => { return state }
})

export default rootReducer
