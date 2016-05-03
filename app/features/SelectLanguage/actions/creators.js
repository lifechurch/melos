import type from './constants'

const ActionCreators = {

	changeLanguage(params) {
		return {
			params,
			api_call: {
				endpoint: 'users',
				method: 'update',
				version: '3.1',
				auth: true,
				params: params,
				http_method: 'post',
				types: [ type('changeLanguageRequest'), type('changeLanguageSuccess'), type('changeLanguageFailure') ]
			}
		}
	}

}

export default ActionCreators