import { getClient } from '@youversion/js-api'
import { handleResponse } from './common'

export const EVENT_FEED_SAVED_REQUEST = 'EVENT_FEED_SAVED_REQUEST'
export const EVENT_FEED_SAVED_SUCCESS = 'EVENT_FEED_SAVED_SUCCESS'
export const EVENT_FEED_SAVED_FAILURE = 'EVENT_FEED_SAVED_FAILURE'

const EventsApi = getClient('events')

function eventFeedSavedRequest() {
	return {
		type: EVENT_FEED_SAVED_REQUEST
	}
}

function eventFeedSavedSuccess(data) {
	return {
		type: EVENT_FEED_SAVED_SUCCESS,
		data
	}
}

function eventFeedSavedFailure(error) {
	return {
		type: EVENT_FEED_SAVED_FAILURE,
		error
	}
}

export function fetchEventFeedSaved() {
	return dispatch => {
		dispatch(eventFeedSavedRequest())
		return EventsApi
			.call('saved_items')
			.setVersion('3.2')
			.params({})
			.get()
			.then((data) => {
				handleResponse(data).then((data) => {
					dispatch(eventFeedSavedSuccess(data))
				}, (error) => {
					dispatch(eventFeedSavedFailure(error))
				})
			}, (error) => {
				dispatch(eventFeedSavedFailure(error))
			})
	}
}