import contentType from './constants'
import { validateDuplicateParams } from '../validators/eventFeedMine.js'
import { routeActions } from 'react-router-redux'

const ActionCreators = {
	duplicate(params) {
		validateDuplicateParams(params)
		return dispatch => {
			dispatch(ActionCreators.callDuplicate(params)).then((event) => {
				const nextUrl = '/event/edit/' + event.id
				dispatch(routeActions.push(nextUrl))
			})
		}
	},

	delete(id, index) {
		return {
			index,
			id,
			api_call: {
				endpoint: 'events',
				method: 'delete',
				version: '3.2',
				auth: true,
				params: { id },
				http_method: 'post',
				types: [ contentType('deleteRequest'), contentType('deleteSuccess'), contentType('deleteFailure') ]
			}
		}
	},


	callDuplicate(params) {
		return {
			params: {
				...params,
			},
			api_call: {
				endpoint: 'events',
				method: 'duplicate',
				version: '3.2',
				auth: true,
				params: params,
				http_method: 'post',
				types: [ contentType('duplicateRequest'), contentType('duplicateSuccess'), contentType('duplicateFailure') ]
			}
		}
	},

	setStatus(index, status) {
		return {
			type: contentType('setStatus'),
			index: index,
			status: status
		}
	},

	configuration() {
		return {
			api_call: {
				endpoint: 'events',
				method: 'configuration',
				version: '3.2',
				params: {},
				http_method: 'get',
				types: [ contentType('configurationRequest'), contentType('configurationSuccess'), contentType('configurationFailure')]
			}
		}
	}

}

export default ActionCreators
