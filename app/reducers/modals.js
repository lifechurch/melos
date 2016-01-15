import { Actions } from '../actions/modals'

export function modals(state = {}, action) {
	switch(action.type) {

		case Actions.OPEN_MODAL:
			var modals = Object.assign({}, state)
			modals[action.key] = true
			return Object.assign({}, state, modals )

		case Actions.CLOSE_MODAL:
			var modals = Object.assign({}, state)
			modals[action.key] = false
			return Object.assign({}, state, modals )

		default:
			return state
			
	}
}