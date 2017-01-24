import subscribedPlans from './subscribedPlans'
import completedPlans from './completedPlans'
import savedPlans from './savedPlans'

import { combineReducers } from 'redux'

export default combineReducers({
	subscribedPlans,
	completedPlans,
	savedPlans
})