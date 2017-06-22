import { combineReducers } from 'redux'
import Immutable from 'immutable'
import type from '../../../features/PlanDiscovery/actions/constants'
import users from '@youversion/api-redux/lib/endpoints/users/reducer'
import search from '@youversion/api-redux/lib/endpoints/search/reducer'
import friends from '@youversion/api-redux/lib/endpoints/friends/reducer'
import readingPlans from '@youversion/api-redux/lib/endpoints/readingPlans/reducer'
import bible from '@youversion/api-redux/lib/endpoints/bible/reducer'

export default combineReducers({
	users,
	search,
	friends,
	readingPlans,
	bible,
})
