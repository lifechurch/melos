import Immutable from 'immutable'

import type from '../actions/constants'
import bibleType from '../../Bible/actions/constants'


export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('restartSubscriptionSuccess'):
		case type('resetSubscriptionSuccess'):
		case type('updateSubscribeUserSuccess'):
		case type('planInfoSuccess'):
			return (function planInfoSuccess() {
				const inStatePlan = state[action.params.id] || { id: action.params.id }
				const fromApiPlan = action.response
				const plan = Immutable.fromJS(inStatePlan).mergeDeep(fromApiPlan).toJS()
				return Immutable.fromJS(state).mergeDeep({ [plan.id]: plan }).toJS()
			}())

		case type('calendarSuccess'):
			return (function calendarSuccess() {
				const inStatePlan = state[action.params.id] || { id: action.params.id }
				const calendar = action.response
				const plan = Immutable.fromJS(inStatePlan).mergeDeep({ calendar: calendar.calendar }).toJS()
				return Immutable.fromJS(state).mergeDeep({ [action.params.id]: plan }).toJS()
			}())

		case bibleType('bibleVersesSuccess'):
			return (function bibleVersesSuccess() {
				const { params: { plan_id, plan_content, plan_day }, response: verse } = action
				if (['string', 'number'].indexOf(typeof plan_id) > -1 && state[plan_id]) {
					const plan = Immutable
						.fromJS(state[plan_id])
						.mergeDeepIn(['calendar', plan_day - 1, 'reference_content', plan_content], verse.verses[0])
						.mergeDeepIn(['calendar', plan_day - 1], { hasReferences: true })
						.toJS()
					return Immutable.fromJS(state).mergeDeep({ [plan.id]: plan }).toJS()
				}
				return state
			}())

		case bibleType('bibleChapterSuccess'):
			return (function bibleVersesSuccess() {
				const { params: { plan_id, plan_content, plan_day }, response: verse } = action
				if (['string', 'number'].indexOf(typeof plan_id) > -1 && state[plan_id]) {
					const plan = Immutable
						.fromJS(state[plan_id])
						.mergeDeepIn(['calendar', plan_day - 1, 'reference_content', plan_content], verse)
						.mergeDeepIn(['calendar', plan_day - 1], { hasReferences: true })
						.toJS()
					return Immutable.fromJS(state).mergeDeep({ [plan.id]: plan }).toJS()
				}
				return state
			}())

		case type('planSelect'):
			return (function planSelect() {
				const inStatePlan = state[action.id] || { id: action.id }
				const plan = Immutable.fromJS(inStatePlan).toJS()
				return Immutable.fromJS(state).set('_SELECTED', plan).toJS()
			}())

		case type('updateCompletionSuccess'):
			return (function updateCompletionSuccess() {
				const { params: { day, id }, response: { references, additional_content } } = action
				if (['string', 'number'].indexOf(typeof id) > -1 && state[id]) {
					let dayObj = Immutable.fromJS(state[id].calendar[day - 1])

					if (references !== 'undefined' && references.length > 0) {
						// build completed and remaining refs from api response
						const completedRefs = []
						const remainingRefs = []
						references.forEach((ref) => {
							if (ref.completed) {
								completedRefs.push(ref.reference)
							} else {
								remainingRefs.push(ref.reference)
							}
						})
						dayObj = dayObj
											.set('references_completed', completedRefs)
											.set('references_remaining', remainingRefs)

						// now check if all refs are completed
						if (completedRefs.length === references.length) {
							// if devo and all refs are completed, then the day is complete
							// or there is no devo, but it still defaults to complete
							if (additional_content.completed) {
								dayObj = dayObj.set('completed', true)
							}
							dayObj = dayObj.set('refs_completed', true)
						}
					} else {
						// if there are no refs then if the devo is complete, than so is the day
						dayObj = dayObj.set('completed', additional_content.completed)
					}

					// whether or not we have refs, we'll match the devo content with the
					// api response (default is true even if there is no devo content)
					dayObj = dayObj.setIn(['additional_content', 'completed'], additional_content.completed)

					return Immutable.fromJS(state).setIn(
						['_SELECTED', 'calendar', day - 1], dayObj.toJS()
					).toJS()
				}

				return state
			}())

		case type('planSubscribeSuccess'):
			return (function planSubscribeSuccess() {
				const inStatePlan = state[action.params.id] || { id: action.params.id }
				const plan = Immutable.fromJS(inStatePlan).set('dirtySubscription', true).toJS()
				return Immutable.fromJS(state).mergeDeep({ [action.params.id]: plan }).toJS()
			}())

		case type('allQueueItemsSuccess'):
			return (function allQueueItemsSuccess() {
				const saved = {}
				action.response.reading_plans.forEach((id) => {
					saved[id] = { id, saved: true }
				})
				const fullPlans = Immutable.fromJS(state).mergeDeep(saved).toJS()
				return fullPlans
			}())

		case type('planSaveforlaterSuccess'):
			return (function planSaveforlaterSuccess() {
				return Immutable.fromJS(state).mergeDeep({ [action.params.id]: { saved: true } }).toJS()
			}())

		case type('planRemoveSaveSuccess'):
			return (function planRemoveSaveSuccess() {
				return Immutable.fromJS(state).mergeDeep({ [action.params.id]: { saved: false } }).toJS()
			}())

		default:
			return state
	}
}
