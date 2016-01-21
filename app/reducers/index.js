import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'
import { eventFeeds } from './eventFeeds' 
import { event } from './event'
import {reducer as formReducer} from 'redux-form';
import { modals } from './modals'
import loc from '../features/EventEdit/features/location/reducers/index'

const rootReducer = combineReducers({
	eventFeeds: eventFeeds,
	event: event,
	modals: modals,
	loc: loc,
  form: formReducer,
  routing: routeReducer
})

export default rootReducer