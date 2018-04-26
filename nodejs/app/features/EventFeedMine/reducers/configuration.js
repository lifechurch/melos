import type from '../actions/constants'

export default function configuration(state = {}, action) {
	switch (action.type) {

		case type('configurationSuccess'):
			return Object.assign({}, state, { startOffset: action.response.start_offset })

		default:
			return state
	}
}
