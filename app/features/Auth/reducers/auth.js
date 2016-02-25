import type from '../actions/constants'
import defaultState from '../../../defaultState'

export default function login(state = {}, action) {
	switch(action.type) {

		case type('authenticationFailed'):
			return Object.assign({}, state, defaultState.auth)

		case type('setField'):
			const { field, value } = action
			return Object.assign({}, state, {
				[field]: value
			})

		case type('authenticateRequest'):
			return Object.assign({}, state, {
				isWorking: true,
				password: null
			})

		case type('authenticateSuccess'):
			const { token } = action.response
			let user = Object.assign({}, action.response)
			delete user.token
			return Object.assign({}, state, {
				isLoggedIn: true,
				isWorking: false,
				token: token,
				userData: user
			})

		case type('authenticateFailure'):
			return Object.assign({}, state, {
				isWorking: false,
				errors: {
					...state.errors,
					api: action.response
				}
			})

		default:
			return state
	}
}
