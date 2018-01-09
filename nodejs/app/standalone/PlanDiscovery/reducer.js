import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import auth from '../../features/Auth/reducers/auth'
import bibleReader from '../../features/Bible/reducers'
import plansDiscovery from '../../features/PlanDiscovery/reducers'
import readingPlans from '../../features/PlanDiscovery/reducers/readingPlans'
import api from '../../features/PlanDiscovery/reducers/api'
import shareData from '../../widgets/ShareSheet/reducer'


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
	locale: emptyReducer,
	// for all the reducers being autopopulated by the api actions
	api,
	plans: combineReducers(plansAPI.reducers),
	shareData
})

export default rootReducer
