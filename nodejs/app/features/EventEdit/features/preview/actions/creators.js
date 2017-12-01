import detailsType from '../../details/actions/constants'

const ActionCreators = {
	publishEvent(params) {
		return {
			params: {
				...params,
			},
			api_call: {
				endpoint: 'events',
				method: 'publish',
				version: '3.2',
				auth: true,
				params,
				http_method: 'post',
				types: [ detailsType('publishEventRequest'), detailsType('publishEventSuccess'), detailsType('publishEventFailure') ]
			}
		}
	},

	unpublishEvent(params) {
		return {
			params: {
				...params,
			},
			api_call: {
				endpoint: 'events',
				method: 'unpublish',
				version: '3.2',
				auth: true,
				params,
				http_method: 'post',
				types: [ detailsType('unpublishEventRequest'), detailsType('unpublishEventSuccess'), detailsType('unpublishEventFailure') ]
			}
		}
	}
}

export default ActionCreators