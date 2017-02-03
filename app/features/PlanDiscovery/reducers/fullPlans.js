import Immutable from 'immutable'

import type from '../actions/constants'
import bibleType from '../../Bible/actions/constants'


export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('planInfoFailure'):
			console.log(action)
			return state

		case type('planInfoSuccess'):
			return (function planInfoSuccess() {
				const inStatePlan = state[action.params.id] || { id: action.params.id }
				const fromApiPlan = action.response
				const plan = Immutable.fromJS(inStatePlan).mergeDeep(fromApiPlan).toJS()
				return Immutable.fromJS(state).set(plan.id, plan).toJS()
			}())

		case type('calendarSuccess'):
			return (function calendarSuccess() {
				const inStatePlan = state[action.params.id] || { id: action.params.id }
				const calendar = action.response
				const plan = Immutable.fromJS(inStatePlan).mergeDeep(calendar).toJS()
				return Immutable.fromJS(state).set(plan.id, plan).toJS()
			}())

		case bibleType('bibleVersesSuccess'):
			return (function bibleVersesSuccess() {
				const { params: { plan_id, plan_content, plan_day }, response: verse } = action
				if (['string', 'number'].indexOf(typeof plan_id) > -1 && state[plan_id]) {
					const plan = Immutable.fromJS(state[plan_id]).setIn(['calendar', plan_day - 1, 'reference_content', plan_content], verse.verses[0]).toJS()
					return Immutable.fromJS(state).set(plan.id, plan).toJS()
				}
				return state
			}())

		case bibleType('bibleChapterSuccess'):
			return (function bibleVersesSuccess() {
				const { params: { plan_id, plan_content, plan_day }, response: verse } = action
				if (['string', 'number'].indexOf(typeof plan_id) > -1 && state[plan_id]) {
					const plan = Immutable.fromJS(state[plan_id]).setIn(['calendar', plan_day - 1, 'reference_content', plan_content], verse).toJS()
					return Immutable.fromJS(state).set(plan.id, plan).toJS()
				}
				return state
			}())

		case bibleType('bibleVersesFailure'):
		case bibleType('bibleChapterFailure'):
			console.log("fail whale", action)
			return state

		case type('planSelect'):
			return (function planSelect() {
				const inStatePlan = state[action.id] || { id: action.id }
				const plan = Immutable.fromJS(inStatePlan).toJS()
				return Immutable.fromJS(state).set('_SELECTED', plan).toJS()
			}())

		case type('updateCompletionSuccess'):
			const { params: { day, devotional, id, references }, response } = action
			if (['string', 'number'].indexOf(typeof id) > -1 && state[id]) {
				let dayObj = Immutable.fromJS(state[id].calendar[day - 1])
				if (typeof references !== 'undefined') {
					// delete ref from remainingRefs array where the ref is equal to the
					// ref passed to updateCompletion
					dayObj = dayObj.deleteIn(['references_remaining'],
						dayObj.get('references_remaining').findIndex((ref) => {
							return (ref.toString() === references[0].toString())
						})
					)
					// push the new ref into references_completed
					dayObj = dayObj.setIn(['references_completed'], dayObj.get('references_remaining').push(references))
				}
				if (typeof devotional !== 'undefined') {
					if (dayObj.getIn('additional_content', 'completed') !== null) {
						dayObj = dayObj.setIn(['additional_content', 'completed'], devotional)
					}
				}
				return Immutable.fromJS(state).setIn(
					['_SELECTED', 'calendar', day - 1], dayObj.toJS()
				).toJS()
			}

			return state

		default:
			return state
	}
}
