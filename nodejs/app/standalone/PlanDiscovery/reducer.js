import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import bibleReader from '../../features/Bible/reducers'
import passage from '../../features/Passage/reducers'
import plansDiscovery from '../../features/PlanDiscovery/reducers'
import readingPlans from '../../features/PlanDiscovery/reducers/readingPlans'
import api from '../../features/PlanDiscovery/reducers/api'

const emptyReducer = (state = {}) => { return state }

const rootReducer = combineReducers({
	auth: emptyReducer,
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
	// for all the reducers being autopopulated by the api actions
	api,
	plans: combineReducers(plansAPI.reducers)
})

export default rootReducer
