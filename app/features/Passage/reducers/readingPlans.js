import Immutable from 'immutable'

import type from '../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {

		case type('readingplansPlansByReferenceRequest'):
			return { loading: true }

		case type('readingplansPlansByReferenceFailure'):
			return Immutable.fromJS(action).set('loading', false).toJS()

		case type('readingplansPlansByReferenceSuccess'):
			return (function readingplansPlansByReferenceSuccess() {
				const plans = action.response.plans.map((plan) => {
					return Immutable.fromJS(plan).set('image_id', plan.id).set('type', 'reading_plan').toJS()
				})
				return Immutable
					.fromJS(action.response)
					.merge({ items: plans, type: false })
					.delete('loading')
					.delete('plans')
					.toJS()
			}())

		default:
			return state
	}
}
