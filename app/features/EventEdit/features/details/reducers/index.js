import type from '../actions/constants'
import locationType from '../../location/actions/constants'
import { validateEventDetails } from '../validators/details'
import defaultState from '../../../../../defaultState'
import { fromApiFormat } from '../../location/transformers/location'


export default function event(state = {}, action) {
	switch(action.type) {
		case type('cancel'):
			return validateEventDetails(Object.assign({}, defaultState.event))

		case type('new'):
			return validateEventDetails(Object.assign({}, defaultState.event))

		case type('viewSuccess'):
			return validateEventDetails(Object.assign({}, state, { item: action.response, isFetching: false, isSaving: false, isDirty: false }))

		case type('viewFailure'):
			//hasError: true, errors: action.error.errors,
			return validateEventDetails(Object.assign({}, state, { isFetching: false, isSaving: false, isDirty: false, api_errors: action.api_errors }))

		case type('viewRequest'):
			return validateEventDetails(Object.assign({}, state, { isFetching: true, isSaving: false, isDirty: false }))

		case type('createSuccess'):
			return validateEventDetails(Object.assign({}, state, { item: action.response, isFetching: false, isSaving: false, isDirty: false }))

		case type('createFailure'):
			//hasError: true, errors: action.error.errors,
			return validateEventDetails(Object.assign({}, state, { isFetching: false, isSaving: false, isDirty: false, api_errors: action.api_errors }))

		case type('updateRequest'):
			return validateEventDetails(Object.assign({}, state, { isFetching: false, isSaving: true, isDirty: false }))

		case type('updateSuccess'):
			return validateEventDetails(Object.assign({}, state, { item: action.response, isFetching: false, isSaving: false, isDirty: false }))

		case type('updateFailure'):
			//hasError: true, errors: action.error.errors,
			return validateEventDetails(Object.assign({}, state, { isFetching: false, isSaving: false, isDirty: false, api_errors: action.api_errors }))

		case type('createRequest'):
			return validateEventDetails(Object.assign({}, state, { isFetching: false, isSaving: true, isDirty: false }))			

		case type('setDetails'):
			if (['title', 'org_name', 'image', 'description'].indexOf(action.field) > -1) {
				let item = Object.assign({}, state.item)
				item[action.field] = action.value
				return validateEventDetails(Object.assign({}, state, { item, isDirty: true }))
			} else {
				return state
			}

		case locationType('removeSuccess'):
			const { index } = action
			const locs = state.item.locations
			return validateEventDetails(Object.assign({}, state, {
				item: {
					locations: [
						...locs.slice(0, index),
						...locs.slice(index + 1)
					]
				}
			}))

		case locationType('createSuccess'):
			const { locations } = state.item
			return validateEventDetails(Object.assign({}, state, {
				item: {
					locations: [
						...locations,
						fromApiFormat(Object.assign({}, action.loc, action.response))
					]
				}
			}))

		default:
			return state
	}
}