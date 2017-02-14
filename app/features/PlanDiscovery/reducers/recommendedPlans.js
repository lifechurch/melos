import Immutable from 'immutable'
import type from '../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('recommendationsItemsRequest'):
			return { loading: true, errors: false }

		case type('recommendationsItemsFailure'):
			return state

		case type('recommendationsItemsSuccess'):
			const { params, response } = action
			if (response.reading_plans) {
				return Immutable.fromJS(state).set('items', response.reading_plans).toJS()
			} else {
				return state
			}

		default:
			return state
	}
}
