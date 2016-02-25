import type from '../actions/constants'
import defaultState from '../../../defaultState'

export default function login(state = {}, action) {
	switch(action.type) {

		case type('logout'):
			return Object.assign({}, state, {
				...defaultState.auth,
				user: state.user
			})

		case type('authenticationFailed'):
			return Object.assign({}, state, {
				...defaultState.auth,
				errors: {
					...state.errors,
					api: "Your session expired. Please login again."
				},
				user: state.user
			})

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
					api: 'Invalid email or password.'
				}
			})

		default:
			return state
	}
}
