import { getClient } from 'youversion-node-api'
import { handleResponse } from './common'

export const EVENT_CREATE_REQUEST = 'EVENT_CREATE_REQUEST'
export const EVENT_CREATE_SUCCESS = 'EVENT_CREATE_SUCCESS'
export const EVENT_CREATE_FAILURE = 'EVENT_CREATE_FAILURE'
export const EVENT_SET_DETAILS = 'EVENT_SET_DETAILS'

var EventsApi = getClient('events')

function eventCreateRequest() {
	return {
		type: EVENT_CREATE_REQUEST
	}
}

function eventCreateSuccess(data) {
	return {
		type: EVENT_CREATE_SUCCESS,
		data: data
	}
}
 
function eventCreateFailure(error) {
	return {
		type: EVENT_CREATE_FAILURE,
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

export function fetchEventView(title, org_name, description) {
	return dispatch => {
		dispatch(eventCreateRequest())
		return EventsApi
			.call("create")
			.setVersion("3.2")
			.setEnvironment("staging")
			.params({title, org_name, description})	
			.post()
			.then(function(data) {
				handleResponse(data).then((data) => {
					dispatch(eventCreateSuccess(data))
				}, (error) => {
					dispatch(eventCreateFailure(error))
				})
			}, function(error) {
				dispatch(eventCreateFailure(error))
			})
	}
}