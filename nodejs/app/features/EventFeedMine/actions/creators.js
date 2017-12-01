import { push } from 'react-router-redux'
import { validateDuplicateParams } from '../validators/eventFeedMine'
import contentType from './constants'

const ActionCreators = {
	duplicate(params, locale) {
		validateDuplicateParams(params)
		return dispatch => {
			dispatch(ActionCreators.callDuplicate(params)).then((event) => {
				const nextUrl = `/${locale}/event/edit/${event.id}`
				dispatch(push(nextUrl))
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
				params,
				http_method: 'post',
				types: [ contentType('duplicateRequest'), contentType('duplicateSuccess'), contentType('duplicateFailure') ]
			}
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