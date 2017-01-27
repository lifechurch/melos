import type from '../actions/constants'
import Immutable from 'immutable'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type("calendarRequest"):
			return state

		case type("calendarFailure"):
			return state

		case type("calendarSuccess"):
			const inStatePlan = state[action.response.id] || {}
			const calendar = action.response
			const plan = Immutable.fromJS(inStatePlan).set('calendar', calendar).toJS()
			return Immutable.fromJS(state).set(plan.id, plan).toJS()

		default:
			return state
	}
}