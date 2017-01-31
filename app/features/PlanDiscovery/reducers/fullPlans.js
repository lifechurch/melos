import type from '../actions/constants'
import bibleType from '../../Bible/actions/constants'

import Immutable from 'immutable'

export default function reducer(state = {}, action) {
	switch (action.type) {

		case type("planInfoSuccess"):
			return (function() {
				const inStatePlan = state[action.params.id] || { id: action.params.id }
				const fromApiPlan = action.response
				const plan = Immutable.fromJS(inStatePlan).mergeDeep(fromApiPlan).toJS()
				return Immutable.fromJS(state).set(plan.id, plan).toJS()
			})()

		case type("calendarSuccess"):
			return (function() {
				const inStatePlan = state[action.params.id] || { id: action.params.id }
				const calendar = action.response
				const plan = Immutable.fromJS(inStatePlan).mergeDeep(calendar).toJS()
				return Immutable.fromJS(state).set(plan.id, plan).toJS()
			})()

		case bibleType("bibleVersesSuccess"):
			return (function() {
				const { params: { plan_id, plan_content, plan_day }, response: verse } = action
				if (['string', 'number'].indexOf(typeof plan_id) > -1 && state[plan_id]) {
					const plan = Immutable.fromJS(state[plan_id]).setIn(['calendar', plan_day - 1, 'reference_content', plan_content], verse.verses[0]).toJS()
					return Immutable.fromJS(state).set(plan.id, plan).toJS()
				}
				return state
			})()

		case type("planSelect"):
			return (function() {
				const inStatePlan = state[action.id] || { id: action.id }
				const plan = Immutable.fromJS(inStatePlan).toJS()
				return Immutable.fromJS(state).set("_SELECTED", plan).toJS()
			})()

		default:
			return state
	}
}