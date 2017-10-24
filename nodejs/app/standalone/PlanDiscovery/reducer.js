import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
// import { eventFeeds } from './eventFeeds'
// import { modals } from './modals'
// import loc from '../features/EventEdit/features/location/reducers/location'
// import locations from '../features/EventEdit/features/location/reducers/locations'
// import event from '../features/EventEdit/features/details/reducers/event'
// import content from '../features/EventEdit/features/content/reducers/content'
// import references from '../features/Bible/reducers'
// import plans from './plans'
// import configuration from '../features/EventFeedMine/reducers/configuration'
// import plansDiscovery from '../features/PlanDiscovery/reducers'
// import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import auth from '../../features/Auth/reducers/auth'
import bibleReader from '../../features/Bible/reducers'
import passage from '../../features/Passage/reducers'
import plansDiscovery from '../../features/PlanDiscovery/reducers'
import readingPlans from '../../features/PlanDiscovery/reducers/readingPlans'
import api from '../../features/PlanDiscovery/reducers/api'


const emptyReducer = (state = {}) => { return state }

const rootReducer = combineReducers({
	auth,
	bibleReader,
	eventFeeds: emptyReducer,
	content: emptyReducer,
	event: emptyReducer,
	modals: emptyReducer,
	loc: emptyReducer,
	locations: emptyReducer,
	readingPlans,
	plansDiscovery,
	configuration: emptyReducer,
	references: emptyReducer,
	routing: routerReducer,
	serverLanguageTag: emptyReducer,
	altVersions: emptyReducer,
	hosts: emptyReducer,
	passage,
	locale: emptyReducer,
	// for all the reducers being autopopulated by the api actions
	api,
	// plans: combineReducers(plansAPI.reducers)
})

export default rootReducer
