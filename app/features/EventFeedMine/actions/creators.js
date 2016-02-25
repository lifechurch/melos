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
	}
}

export default ActionCreators