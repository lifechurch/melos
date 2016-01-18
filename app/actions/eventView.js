import { getClient } from '@youversion/js-api'
import { handleResponse } from './common'

export const EVENT_VIEW_REQUEST = 'EVENT_VIEW_REQUEST'
export const EVENT_VIEW_SUCCESS = 'EVENT_VIEW_SUCCESS'
export const EVENT_VIEW_FAILURE = 'EVENT_VIEW_FAILURE'

var EventsApi = getClient('events')

function eventViewRequest() {
	return {
		type: EVENT_VIEW_REQUEST
	}
}

function eventViewSuccess(data) {
	return {
		type: EVENT_VIEW_SUCCESS,
		data: data
	}
}
 
function eventViewFailure(error) {
	return {
		type: EVENT_VIEW_FAILURE,
		error: error
	}
}

export function fetchEventView(id) {
	return dispatch => {
		dispatch(eventViewRequest())
		return EventsApi
			.call("view")
			.setVersion("3.2")
			.setEnvironment("staging")
			.params({id})	
			.get()
			.then(function(data) {
				handleResponse(data).then((data) => {
					dispatch(eventViewSuccess(data))
				}, (error) => {
					dispatch(eventViewFailure(error))
				})
			}, function(error) {
				dispatch(eventViewFailure(error))
			})
	}
}