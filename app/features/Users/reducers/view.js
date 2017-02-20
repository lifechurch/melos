import Immutable from 'immutable'
import type from '../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('usersViewRequest'):
			return state

		case type('usersViewFailure'):
			return state

		case type('usersViewSuccess'):
			const { params, response } = action
			if (response && response.id) {
				return Immutable.fromJS(state)
				.set([response.id], response)
				.toJS()
			} else {
				return state
			}

		default:
			return state
	}
}
