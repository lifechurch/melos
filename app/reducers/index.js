import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'
import { eventFeeds } from './eventFeeds' 
import { event } from './event'
import {reducer as formReducer} from 'redux-form';

const rootReducer = combineReducers({
	eventFeeds: eventFeeds,
	event: event,
  form: formReducer,
  routing: routeReducer
})

export default rootReducer