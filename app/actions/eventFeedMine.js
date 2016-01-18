import { getClient } from '@youversion/js-api'
import { handleResponse } from './common'

export const EVENT_FEED_MINE_REQUEST = 'EVENT_FEED_MINE_REQUEST'
export const EVENT_FEED_MINE_SUCCESS = 'EVENT_FEED_MINE_SUCCESS'
export const EVENT_FEED_MINE_FAILURE = 'EVENT_FEED_MINE_FAILURE'

var EventsApi = getClient('events')

function eventFeedMineRequest() {
	return {
		type: EVENT_FEED_MINE_REQUEST
	}
}

function eventFeedMineSuccess(data) {
	return {
		type: EVENT_FEED_MINE_SUCCESS,
		data: data
	}
}
 
function eventFeedMineFailure(error) {
	return {
		type: EVENT_FEED_MINE_FAILURE,
		error: error
	}
}

export function fetchEventFeedMine() {
	return dispatch => {
		dispatch(eventFeedMineRequest())
		return EventsApi
			.call("items")
			.setVersion("3.2")
			.setEnvironment("staging")
			.params({query: 'Life.Church'})	
			.auth('ignacio', 'password')		
			.get()
			.then(function(data) {
				handleResponse(data).then((data) => {
					dispatch(eventFeedMineSuccess(data))
				}, (error) => {
					dispatch(eventFeedMineFailure(error))
				})
			}, function(err) {
				dispatch(eventFeedMineFailure(err))
			})
	}
}
