import { getClient } from '@youversion/js-api'
import { handleResponse } from './common'

export const EVENT_UPDATE_REQUEST = 'EVENT_UPDATE_REQUEST'
export const EVENT_UPDATE_SUCCESS = 'EVENT_UPDATE_SUCCESS'
export const EVENT_UPDATE_FAILURE = 'EVENT_UPDATE_FAILURE'

const EventsApi = getClient('events')

function eventUpdateRequest() {
	return {
		type: EVENT_UPDATE_REQUEST
	}
}

function eventUpdateSuccess(data) {
	return {
		type: EVENT_UPDATE_SUCCESS,
		data
	}
}

function eventUpdateFailure(error) {
	return {
		type: EVENT_UPDATE_FAILURE,
		error
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
	const { title, org_name, description, image_id } = event
	return dispatch => {
		dispatch(eventUpdateRequest())
		return EventsApi
			.call('update')
			.setVersion('3.2')
			.auth()
			.params({ title, org_name, description, image_id })
			.post()
			.then((data) => {
				handleResponse(data).then((data) => {
					dispatch(eventUpdateSuccess(data))
				}, (error) => {
					dispatch(eventUpdateFailure(error))
				})
			}, (error) => {
				dispatch(eventUpdateFailure(error))
			})
	}
}
