import type from '../actions/constants'


export default function content(state = {}, action) {
	switch (action.type) {

		case type('addRequest'):
			return Object.assign({}, state, action.params)

		case type('addSuccess'):
			return Object.assign({}, action.response, state)

		case type('addFailure'):
			return state

		case type('reorderRequest'):
		case type('reorderSuccess'):
		case type('reorderFailure'):
			return state

		case type('setInsertionPoint'):
			return Object.assign({}, state, { insertionPoint: action.index })

		case type('new'):
			return Object.assign({}, state, { insertionPoint: 0 })

		default:
			return state
	}
}
