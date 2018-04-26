import type from './constants'

const ActionCreators = {

	passwordChange(params) {
		return {
			api_call: {
				endpoint: 'users',
				method: 'update_password',
				version: '3.1',
				auth: false,
				params,
				http_method: 'post',
				types: [ type('passwordChangeRequest'), type('passwordChangeSuccess'), type('passwordChangeFailure') ]
			},
			params
		}
	},

	passwordSetField(params) {
		return {
			type: type('passwordSetField'),
			params
		}
	}

}

export default ActionCreators