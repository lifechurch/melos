import type from './constants'
import { routeActions } from 'react-router-redux'
import { storeToken, deleteToken } from '@youversion/token-storage'

const ActionCreators = {
	logout() {
		return dispatch => {
			deleteToken()
			dispatch({ type: type('logout') })
			dispatch(routeActions.push('/login'))
		}
	},

	authenticationFailed() {
		return {
			type: type('authenticationFailed')
		}
	},

	setField(params) {
		return {
			type: type('setField'),
			...params
		}
	},

	authenticate(params) {
		return dispatch => {
			dispatch(ActionCreators.callAuthenticate(params)).then((authResponse) => {
				if (!(authResponse instanceof Error)) {
					storeToken(authResponse.token)
					dispatch(routeActions.push('/'))
				}
			})
		}
	},

	checkToken() {
		return dispatch => {
			dispatch(ActionCreators.callCheckToken())
		}
	},

	callAuthenticate(params) {
		const { user, password } = params
		return {
			params: {
				...params,
			},
			api_auth: {
				method: 'authenticate',
				params: [user, password],
				types: [ type('authenticateRequest'), type('authenticateSuccess'), type('authenticateFailure') ]
			}
		}
	},

	callCheckToken() {
		return {
			api_auth: {
				method: 'checkToken',
				params: [],
				types: [ type('checkTokenRequest'), type('checkTokenSuccess'), type('checkTokenFailure') ]
			}
		}
	}
}

export default ActionCreators