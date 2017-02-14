import Immutable from 'immutable'

import type from './constants'

const ActionCreators = {

	usersView(params, auth) {
		return {
			params,
			api_call: {
				endpoint: 'users',
				method: 'view',
				version: '3.1',
				auth,
				params,
				http_method: 'get',
				types: [ type('usersViewRequest'), type('usersViewSuccess'), type('usersViewFailure') ]
			}
		}
	},

}

export default ActionCreators
