import type from '../actions/constants'
import Immutable from 'immutable'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('momentsColorsRequest'):
		case type('momentsColorsFailure'):
			return state

		case type('momentsColorsSuccess'):
			if (typeof action.response.colors !== 'undefined') {
				return Immutable.fromJS(action.response.colors).toJS()
			} else {
				return state
			}

		default:
			return state
	}
}