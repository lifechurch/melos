import { combineReducers } from 'redux'
import Immutable from 'immutable'
import type from '../../../features/PlanDiscovery/actions/constants'
import users from '../../../../../youversion-api-redux/src/endpoints/users/reducer'
import search from '../../../../../youversion-api-redux/src/endpoints/search/reducer'
import friends from '../../../../../youversion-api-redux/src/endpoints/friends/reducer'
import readingPlans from '../../../../../youversion-api-redux/src/endpoints/readingPlans/reducer'
import bible from '../../../../../youversion-api-redux/src/endpoints/bible/reducer'

export default combineReducers({
	users,
	search,
	friends,
	readingPlans,
	bible,
})
