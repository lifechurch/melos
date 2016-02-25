import { combineReducers } from 'redux'
import { routeReducer } from 'react-router-redux'
import { eventFeeds } from './eventFeeds'
import { modals } from './modals'
import auth from '../features/Auth/reducers/auth'
import loc from '../features/EventEdit/features/location/reducers/location'
import locations from '../features/EventEdit/features/location/reducers/locations'
import event from '../features/EventEdit/features/details/reducers/event'
import content from '../features/EventEdit/features/content/reducers/content'
import plans from './plans'

const rootReducer = combineReducers({
	auth: auth,
	eventFeeds: eventFeeds,
	content,
	event: event,
	modals: modals,
	loc: loc,
	locations,
	plans,
  routing: routeReducer
})

export default rootReducer
