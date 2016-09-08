import type from './constants'

const ActionCreators = {

	readingplanView(params, auth) {
		return {
			params,
			api_call: {
				endpoint: 'reading-plans',
				method: 'view',
				version: '3.1',
				auth: auth,
				params: params,
				http_method: 'get',
				types: [ type('planInfoRequest'), type('planInfoSuccess'), type('planInfoFailure') ]
			}
		}
	},

	readingplanSaveforlater(params, auth) {
		return {
			params,
			api_call: {
				endpoint: 'reading-plans',
				method: 'add_to_queue',
				version: '3.1',
				auth: auth,
				params: params,
				http_method: 'post',
				types: [ type('planSaveforlaterRequest'), type('planSaveforlaterSuccess'), type('planSaveforlaterFailure') ]
			}
		}
	},

	readingplanRemoveSave(params, auth) {
		return {
			params,
			api_call: {
				endpoint: 'reading-plans',
				method: 'remove_from_queue',
				version: '3.1',
				auth: auth,
				params: params,
				http_method: 'post',
				types: [ type('planRemoveSaveRequest'), type('planRemoveSaveSuccess'), type('planRemoveSaveFailure') ]
			}
		}
	},

	configuration() {
		return {
			api_call: {
				endpoint: 'reading-plans',
				method: 'configuration',
				version: '3.1',
				auth: false,
				params: {},
				http_method: 'get',
				types: [ type('configurationRequest'), type('configurationSuccess'), type('configurationFailure') ]
			}
		}
	}

}

export default ActionCreators