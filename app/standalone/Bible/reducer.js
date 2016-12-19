// import rootReducer from '../../reducers/index'
// export default rootReducer

import { combineReducers } from 'redux'
import { routeReducer } from 'react-router-redux'
// import { eventFeeds } from './eventFeeds'
// import { modals } from './modals'
// import auth from '../../features/Auth/reducers/auth'
// import loc from '../features/EventEdit/features/location/reducers/location'
// import locations from '../features/EventEdit/features/location/reducers/locations'
// import event from '../features/EventEdit/features/details/reducers/event'
// import content from '../features/EventEdit/features/content/reducers/content'
// import references from '../features/Bible/reducers'
// import plans from './plans'
// import configuration from '../features/EventFeedMine/reducers/configuration'
// import plansDiscovery from '../features/PlanDiscovery/reducers'
import bibleReader from '../../features/Bible/reducers'

const rootReducer = combineReducers({
	auth: (state = {}, action) => { return state },
	bibleReader,
	// eventFeeds,
	// content,
	// event,
	// modals,
	// loc,
	// locations,
	// plans,
	// plansDiscovery,
	// configuration,
	// references,
	routing: routeReducer,
	serverLanguageTag: (state = {}, action) => { return state },
	hosts: (state = {}, action) => { return state }
})

export default rootReducer
