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
import type from '../features/EventFeedMine/actions/constants'
import detailsType from '../features/EventFeedMine/actions/constants'

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
			var newMine = Object.assign({}, state.mine, { items: action.response.events, page: action.params.page, next_page: action.response.next_page, hasError: false, errors: [], isFetching: false})
			return Object.assign({}, state, { mine: newMine })

		case EVENT_FEED_MINE_FAILURE:
			return Object.assign({}, state, { mine: { hasError: true, errors: action.api_errors, isFetching: false }})

		case EVENT_FEED_MINE_REQUEST:
			return Object.assign({}, state, { mine: { isFetching: true }})

		case type('setStatus'):
			var itemsCopy = state.mine.items.slice(0)
			itemsCopy[action.index].status = action.status
			return Object.assign({}, state, { mine: { items: itemsCopy } })

		case detailsType('deleteRequest'):
			return Object.assign({}, state, {
				mine: {
					...state.mine,
					items: [
						...state.mine.items.slice(0, action.index),
						...state.mine.items.slice(action.index + 1)
					]
				}
			})

		default:
			return state;
	}
}
