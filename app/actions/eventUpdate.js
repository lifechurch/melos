import { getClient } from 'youversion-node-api'
import { handleResponse } from './common'

export const EVENT_UPDATE_REQUEST = 'EVENT_UPDATE_REQUEST'
export const EVENT_UPDATE_SUCCESS = 'EVENT_UPDATE_SUCCESS'
export const EVENT_UPDATE_FAILURE = 'EVENT_UPDATE_FAILURE'

var EventsApi = getClient('events')

function eventUpdateRequest() {
	return {
		type: EVENT_UPDATE_REQUEST
	}
}

function eventUpdateSuccess(data) {
	return {
		type: EVENT_UPDATE_SUCCESS,
		data: data
	}
}
 
function eventUpdateFailure(error) {
	return {
		type: EVENT_UPDATE_FAILURE,
		error: error
	}
}

export function eventSetDetails(field, value) {
	return {
		type: EVENT_SET_DETAILS,
		field,
		value
	}
}

export function updateEvent(event) {
	const { title, org_name, description } = event
	return dispatch => {
		dispatch(eventUpdateRequest())
		return EventsApi
			.call("update")
			.setVersion("3.2")
			.setEnvironment("staging")
			.auth('ignacio', 'password')
			.params({title, org_name, description})	
			.post()
			.then(function(data) {
				handleResponse(data).then((data) => {
					dispatch(eventUpdateSuccess(data))
				}, (error) => {
					dispatch(eventUpdateFailure(error))
				})
			}, function(error) {
				dispatch(eventUpdateFailure(error))
			})
	}
}