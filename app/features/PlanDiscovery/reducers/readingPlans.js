import subscribedPlans from './subscribedPlans'
import completedPlans from './completedPlans'
import savedPlans from './savedPlans'
import fullPlans from './fullPlans'
import { combineReducers } from 'redux'

export default combineReducers({
	subscribedPlans,
	completedPlans,
	savedPlans,
	fullPlans
})