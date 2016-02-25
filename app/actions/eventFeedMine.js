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

export function fetchEventFeedMine(params) {
	return {
		params: {
			...params,
		},
		api_call: {
			endpoint: 'events',
			method: 'items',
			version: '3.2',
			auth: true,
			params: params,
			http_method: 'get',
			types: [ EVENT_FEED_MINE_REQUEST, EVENT_FEED_MINE_SUCCESS, EVENT_FEED_MINE_FAILURE ]
		}
	}
}
