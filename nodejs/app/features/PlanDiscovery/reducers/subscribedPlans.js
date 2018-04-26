import type from '../actions/constants'
import Immutable from 'immutable'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('itemsRequest'):
			const { params: { page } } = action
			if (page === 1) {
				return { pages: {}, nextPage: null, items: [] }
			} else {
				return state
			}

		case type('itemsFailure'):
			return state

		case type('itemsSuccess'):
			const pages = Immutable.fromJS(state.pages).toJS()
			if (typeof pages[action.params.page] === 'undefined') {
				pages[action.params.page] = true
				return { pages, nextPage: action.response.next_page, items: Immutable.fromJS(state.items).concat(action.response.reading_plans).toJS() }
			} else {
				return state
			}

		default:
			return state
	}
}