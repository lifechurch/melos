import { routeActions } from 'react-router-redux'
import cookie from 'react-cookie'
import { storeToken, deleteToken } from '@youversion/token-storage'
import type from './constants'

const ActionCreators = {
	logout(locale) {
		return dispatch => {
			deleteToken()
			cookie.remove('OAUTH', { path: '/' })
			dispatch({ type: type('logout') })
			dispatch(routeActions.push(`/${locale}/login`))
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

	authenticate(params, locale) {
		return dispatch => {
			dispatch(ActionCreators.callAuthenticate(params)).then((authResponse) => {
				if (!(authResponse instanceof Error)) {
					storeToken(authResponse.token)
					dispatch(routeActions.push(`/${locale}/`))
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
