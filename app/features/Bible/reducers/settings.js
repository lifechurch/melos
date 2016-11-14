import type from '../actions/constants'
import Immutable from 'immutable'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('usersViewSettingsRequest'):
			return { loading: true }

		case type('usersViewSettingsSuccess'):
			if (typeof action.response !== 'undefined') {
				return Immutable.fromJS(action.response).toJS()
			} else {
				return state
			}

		case type('usersViewSettingsFailure'):
			return { error: true }

		default:
			return state
	}
}