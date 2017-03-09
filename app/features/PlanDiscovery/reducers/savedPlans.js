import Immutable from 'immutable'
import type from '../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('savedItemsRequest'):
			return (function savedItemsRequest() {
				const { params: { page } } = action
				if (page === 1) {
					return Immutable
						.fromJS(state)
						.set('pages', {})
						.set('nextPage', null)
						.set('items', [])
						.toJS()
				}
				return state
			}())

		case type('savedItemsFailure'):
			return state

		case type('allQueueItemsSuccess'):
			return (function allQueueItemsSuccess() {
				const { response: { reading_plans: allQueuedIds } } = action
				if (Array.isArray(allQueuedIds)) {
					return Immutable
						.fromJS(state)
						.set('all', allQueuedIds)
						.toJS()
				}
				return state
			}())

		case type('planSaveforlaterSuccess'):
			return (function planSaveforlaterSuccess() {
				const { params: { id } } = action
				let all = []
				if (Array.isArray(state.all)) {
					all = state.all
				}
				return Immutable.fromJS(state)
					.set('all', Immutable.fromJS(all).push(id).toJS())
					.toJS()
			}())

		case type('planRemoveSaveSuccess'):
			return (function planRemoveSaveSuccess() {
				const { params: { id } } = action
				if (Array.isArray(state.all)) {
					const index = state.all.indexOf(id)
					if (index > -1) {
						return Immutable.fromJS(state)
							.set('all', Immutable.fromJS(state.all).delete(index).toJS())
							.toJS()
					}
				}
				return state
			}())

		case type('savedItemsSuccess'):
			return (function savedItemsSuccess() {
				if (state.pages) {
					const pages = Immutable.fromJS(state.pages).toJS()
					if (typeof pages[action.params.page] === 'undefined') {
						const all = Array.isArray(state.all) ? Immutable.fromJS(state.all).toJS() : []
						pages[action.params.page] = true
						const reading_plans = action.response.reading_plans.map((plan) => {
							let p = Immutable
								.fromJS(plan)
								.mergeDeep({ title: plan.name.default, type: 'reading_plan', all })

							// when slides are being built, if there are no images then when the slide checks for image_id, it'll be null
							if (plan.images != null) p = p.set('image_id', plan.id) // else plan.image_id doesn't exist

							return p.toJS()
						})
						return { all, pages, nextPage: action.response.next_page, items: Immutable.fromJS(state.items).concat(reading_plans).toJS() }
					} else {
						return state
					}
				} else {
					return state
				}
			}())

		default:
			return state
	}
}
