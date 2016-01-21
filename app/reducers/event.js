import { 
	EVENT_VIEW_SUCCESS, 
	EVENT_VIEW_REQUEST, 
	EVENT_VIEW_FAILURE,
	EVENT_CREATE_SUCCESS,
	EVENT_CREATE_REQUEST,
	EVENT_CREATE_FAILURE,
	EVENT_SET_DETAILS
} from '../actions'

import type from '../features/EventEdit/features/location/actions/constants'

import { isEventDetailsValid } from '../validators/event'

export function event(state = {}, action) {
	switch(action.type) {
		case EVENT_VIEW_SUCCESS:
			return Object.assign({}, state, { item: action.data, hasError: false, errors: [], isFetching: false, isSaving: false, isDirty: false, detailsValid: isEventDetailsValid(action.data) })

		case EVENT_VIEW_FAILURE:
			return Object.assign({}, state, { hasError: true, errors: action.error.errors, isFetching: false, isSaving: false, isDirty: false, detailsValid: isEventDetailsValid(state.item) })

		case EVENT_VIEW_REQUEST:
			let item = Object.assign({}, state.item)
			return Object.assign({}, state, { item, isFetching: true, isSaving: false, isDirty: false, detailsValid: isEventDetailsValid(state.item) })

		case EVENT_CREATE_SUCCESS:
			return Object.assign({}, state, { item: action.data, hasError: false, errors: [], isFetching: false, isSaving: false, isDirty: false, detailsValid: isEventDetailsValid(action.data) })

		case EVENT_CREATE_FAILURE:
			return Object.assign({}, state, { hasError: true, errors: action.error.errors, isFetching: false, isSaving: false, isDirty: false, detailsValid: isEventDetailsValid(state.item) })

		case EVENT_CREATE_REQUEST:
			return Object.assign({}, state, { isFetching: false, isSaving: true, isDirty: false, detailsValid: isEventDetailsValid(state.item) })

		case EVENT_SET_DETAILS:
			if (['title', 'org_name', 'image', 'description'].indexOf(action.field) > -1) {
				let item = Object.assign({}, state.item)
				item[action.field] = action.value
				return Object.assign({}, state, { item, isDirty: true, detailsValid: isEventDetailsValid(item) })
			} else {
				return state
			}

		case type('createSuccess'):
			const { locations } = state.item
			return Object.assign({}, state, {
				item: {
					locations: [
						...locations,
						action.loc
					]
				}
			})

		default:
			return state
	}
}