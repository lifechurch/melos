import Immutable from 'immutable'
import type from '../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('savedItemsRequest'):
			const { params: { page } } = action
			if (page === 1) {
				return { pages: {}, nextPage: null, items: [] }
			} else {
				return state
			}

		case type('savedItemsFailure'):
			return state

		case type('savedItemsSuccess'):
			if (state.pages) {
				const pages = Immutable.fromJS(state.pages).toJS()
				if (typeof pages[action.params.page] === 'undefined') {
					pages[action.params.page] = true
					const reading_plans = action.response.reading_plans.map((plan) => {
						let p = Immutable.fromJS(plan).mergeDeep({ title: plan.name.default, type: 'reading_plan' })

						// when slides are being built, if there are no images then when the slide checks for image_id, it'll be null
						if (plan.images != null) p = p.set('image_id', plan.id) // else plan.image_id doesn't exist

						return p.toJS()
					})
					return { pages, nextPage: action.response.next_page, items: Immutable.fromJS(state.items).concat(reading_plans).toJS() }
				} else {
					return state
				}
			} else {
				return state
			}

		default:
			return state
	}
}
