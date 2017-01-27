import type from '../actions/constants'
import Immutable from 'immutable'

export default function reducer(state = {}, action) {
	switch (action.type) {

		// VIEW
		case type("planInfoRequest"):
			return state

		case type("planInfoFailure"):
			return state

		case type("planInfoSuccess"):
			console.log("planInfoSuccess")
			const inStatePlan = state[action.response.id] || { id: action.params.id }
			const fromApiPlan = action.response
			const plan = Immutable.fromJS(inStatePlan).mergeDeep(fromApiPlan).toJS()
			return Immutable.fromJS(state).set(plan.id, plan).toJS()


		// CALENDAR
		case type("calendarRequest"):
			return state

		case type("calendarFailure"):
			return state

		case type("calendarSuccess"):
			return (function() {
				const inStatePlan = state[action.response.id] || { id: action.params.id }
				const calendar = action.response
				const plan = Immutable.fromJS(inStatePlan).mergeDeep(calendar).toJS()
				return Immutable.fromJS(state).set(plan.id, plan).toJS()
			})()

		// SELECT
		case type("planSelect"):
			return (function() {
				const inStatePlan = state[action.id] || { id: action.id }
				const plan = Immutable.fromJS(inStatePlan).toJS()
				console.log("planSelect", plan.name)
				return Immutable.fromJS(state).set("_SELECTED", plan).toJS()
			})()

		default:
			return state
	}
}