import loginType from './constants'
import { routeActions } from 'react-router-redux'

const ActionCreators = {
	setField(params) {
		return {
			type: loginType('setField'),
			...params
		}
	},

	authenticate(params) {
		return dispatch => {
			dispatch(ActionCreators.callAuthenticate(params)).then((event) => {
				const nextUrl = '/event/edit/' + event.id
				dispatch(routeActions.push(nextUrl))
			})
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
				types: [ loginType('authenticateRequest'), loginType('authenticateSuccess'), loginType('authenticateFailure') ]
			}
		}
	}
}

export default ActionCreators