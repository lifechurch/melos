import oauthAPI from '@youversion/api-redux/lib/endpoints/oauth'
import type from '../actions/constants'
import defaultState from '../../../defaultState'

export default function login(state = {}, action) {
	switch (action.type) {

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
					api: 'features.Auth.errors.sessionExpired'
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
			const user = Object.assign({}, action.response)
			delete user.token

			if (user.language_tag !== window.__LOCALE__.locale) {
				window.location = `/${user.language_tag}/`
			}

			return Object.assign({}, state, {
				isLoggedIn: true,
				isWorking: false,
				token,
				userData: user
			})

		case type('authenticateFailure'):
			return Object.assign({}, state, {
				isWorking: false,
				errors: {
					...state.errors,
					api: 'features.Auth.errors.invalidEmail'
				}
			})

		// overwrite oauth state with refresh response
		case oauthAPI.events.refresh.actionSuccess:
			return Object.assign({}, state, {
				oauth: action.data
			})

		default:
			return state
	}
}
