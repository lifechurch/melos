import { combineReducers } from 'redux'
import { routeReducer } from 'react-router-redux'
import { eventFeeds } from './eventFeeds'
import {reducer as formReducer} from 'redux-form';
import { modals } from './modals'
import loc from '../features/EventEdit/features/location/reducers/location'
import locations from '../features/EventEdit/features/location/reducers/locations'
import event from '../features/EventEdit/features/details/reducers/event'
import content from '../features/EventEdit/features/content/reducers/content'
import references from './references'
import plans from './plans'

const rootReducer = combineReducers({
	eventFeeds: eventFeeds,
	content,
	event: event,
	modals: modals,
	loc: loc,
	locations,
	plans,
	references,
  form: formReducer,
  routing: routeReducer
})

export default rootReducer
