import Immutable from 'immutable'
import type from '../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('recommendationsItemsRequest'):
			return { loading: true, [action.params.id]: {} }

		case type('recommendationsItemsFailure'):
			return state

		case type('recommendationsItemsSuccess'):
			const { params, response } = action
			if (response.reading_plans) {
				const reading_plans = response.reading_plans.map((plan) => {
					let p = Immutable.fromJS(plan).mergeDeep({ title: plan.name.default, type: 'reading_plan' })

					// when slides are being built, if there are no images then when the slide checks for image_id, it'll be null
					if (plan.images != null) p = p.set('image_id', plan.id) // else plan.image_id doesn't exist

					return p.toJS()
				})
				return Immutable.fromJS(state).setIn([params.id, 'items'], reading_plans).set('loading', false).toJS()
			} else {
				return state
			}

		default:
			return state
	}
}
