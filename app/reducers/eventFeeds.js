import {
	EVENT_FEED_DISCOVER_SUCCESS,
	EVENT_FEED_DISCOVER_REQUEST,
	EVENT_FEED_DISCOVER_FAILURE,
	EVENT_FEED_SAVED_SUCCESS,
	EVENT_FEED_SAVED_REQUEST,
	EVENT_FEED_SAVED_FAILURE,
	EVENT_FEED_MINE_SUCCESS,
	EVENT_FEED_MINE_REQUEST,
	EVENT_FEED_MINE_FAILURE
} from '../actions'

export function eventFeeds(state = {}, action) {
	switch(action.type) {
		case EVENT_FEED_DISCOVER_SUCCESS:
			return Object.assign({}, state, { discover: { items: action.data.events, hasError: false, errors: [], isFetching: false}})

		case EVENT_FEED_DISCOVER_FAILURE:
			return Object.assign({}, state, { discover: { hasError: true, errors: action.error.errors, isFetching: false }})

		case EVENT_FEED_DISCOVER_REQUEST:
			return Object.assign({}, state, { discover: { isFetching: true }})

		case EVENT_FEED_SAVED_SUCCESS:
			return Object.assign({}, state, { saved: { items: action.data, hasError: false, errors: [], isFetching: false}})

		case EVENT_FEED_SAVED_FAILURE:
			return Object.assign({}, state, { saved: { hasError: true, errors: action.error.errors, isFetching: false }})

		case EVENT_FEED_SAVED_REQUEST:
			return Object.assign({}, state, { saved: { isFetching: true }})

		case EVENT_FEED_MINE_SUCCESS:
			return Object.assign({}, state, { mine: { items: action.response.events, page: action.params.page, next_page: action.response.next_page, hasError: false, errors: [], isFetching: false}})

		case EVENT_FEED_MINE_FAILURE:
			return Object.assign({}, state, { mine: { hasError: true, errors: action.api_errors, isFetching: false }})

		case EVENT_FEED_MINE_REQUEST:
			return Object.assign({}, state, { mine: { isFetching: true }})

		default:
			return state;
	}
}
