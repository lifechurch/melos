import type from '../actions/constants'
import Immutable from 'immutable'

export default function reducer(state = {}, action) {
	switch (action.type) {

		// VIEW
		case type("planInfoRequest"):
			return state

		case type("planInfoFailure"):
		console.log('faliure plan ifno')
			return state

		case type("planInfoSuccess"):
			return (function() {
				console.log("planInfoSuccess", action.params.id)
				const inStatePlan = state[action.params.id] || { id: action.params.id }
				const fromApiPlan = action.response
				const plan = Immutable.fromJS(inStatePlan).mergeDeep(fromApiPlan).toJS()
				return Immutable.fromJS(state).set(plan.id, plan).toJS()
			})()

		// CALENDAR
		case type("calendarRequest"):
			return state

		case type("calendarFailure"):
		console.log('faliure calendar')
			return state

		case type("calendarSuccess"):
			return (function() {
				console.log("cal success", action.params.id)
				const inStatePlan = state[action.params.id] || { id: action.params.id }
				const calendar = action.response
				const plan = Immutable.fromJS(inStatePlan).mergeDeep(calendar).toJS()
				return Immutable.fromJS(state).set(plan.id, plan).toJS()
			})()

		// SELECT
		case type("planSelect"):
			return (function() {
				console.log("planSelect success")
				const inStatePlan = state[action.id] || { id: action.id }
				const plan = Immutable.fromJS(inStatePlan).toJS()
				console.log("planSelect", Object.keys(plan))
				return Immutable.fromJS(state).set("_SELECTED", plan).toJS()
			})()

		default:
			return state
	}
}