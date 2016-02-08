import type from '../actions/constants'
import locationType from '../../location/actions/constants'
import contentType from '../../content/actions/constants'
import { validateEventDetails } from '../validators/details'
import { fromApiFormat as eventFromApiFormat } from '../transformers/event'
import defaultState from '../../../../../defaultState'
import { fromApiFormat as locationFromApiFormat } from '../../location/transformers/location'
import { fromApiFormat as contentFromApiFormat } from '../../content/transformers/content'
import arrayToObject from '../../../../../lib/arrayToObject'
import mergeObjects from '../../../../../lib/mergeObjects'

function selectLocation(locations, id, selected) {
	if (['string', 'number'].indexOf(typeof id) === -1) {
		throw new Error('Invalid location id, cannot remove:' + id.toString())
	}
	locations[id].isSelected = selected
	locations[id].times = []
	return locations
}

export default function event(state = {}, action) {
	switch(action.type) {
		case type('cancel'):
			return validateEventDetails(Object.assign({}, defaultState.event))

		case type('new'):
			return validateEventDetails(Object.assign({}, defaultState.event))

		case type('viewSuccess'):
			return eventFromApiFormat(Object.assign({}, state, { item: action.response, isFetching: false, isSaving: false, isDirty: false }, {
				item: {
					...action.response,
					locations: arrayToObject(action.response.locations, 'id')
				}
			}))

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

		case locationType('addLocationFailure'):
			return state

		case locationType('addLocationSuccess'):
			return state

		case locationType('addLocationRequest'):
			return validateEventDetails(Object.assign({}, state, {
				item: {
					...state.item,
					locations: selectLocation(Object.assign({}, state.item.locations), action.locationId, true)
				}
			}))

		case locationType('removeLocationFailure'):
			return state

		case locationType('removeLocationSuccess'):
			return state

		case locationType('deleteRequest'):
			const eLocs  = state.item.locations
			delete eLocs[action.locationId]
			return validateEventDetails(Object.assign({}, state, {
				item: {
					...state.item,
					locations: eLocs
				}
			}))

		case locationType('removeLocationRequest'):
			return validateEventDetails(Object.assign({}, state, {
				item: {
					...state.item,
					locations: selectLocation(Object.assign({}, state.item.locations), action.locationId, false)
				}
			}))			

		case locationType('updateRequest'):
			const { params } = action
			const newParams = Object.assign({}, params, { id: params.location_id })
			return Object.assign({}, state, {
				item: {
					...state.item,
					locations: {
						...state.item.locations,
						[newParams.id]: Object.assign({}, state.item.locations[newParams.id], newParams)
					}
				}
			})

		case locationType('createSuccess'):
			const { locations } = state.item
			return validateEventDetails(Object.assign({}, state, {
				item: {
					...state.item,
					locations: {
						...locations,
						[action.response.id]: locationFromApiFormat(Object.assign({}, action.loc, action.response, { isSelected: true }))
					}
				}
			}))

		case locationType('itemsSuccess'):
			const allLocations = arrayToObject(action.response.locations.map((location) => {
				return {
					...location,
					times: [],
					isSelected: false
				}
			}), 'id')

			var eventLocations = state.item.locations
			if (Array.isArray(eventLocations)) {
				eventLocations = arrayToObject(eventLocations.map((location) => {
					return {
						...location,
						times: Array.isArray(location.times) ? location.times : [],
						isSelected: true
					}
				}), 'id')
			}

			var locations = mergeObjects(allLocations, eventLocations)

			return Object.assign({}, state, {
				item: { ...state.item, locations }
			})

		case contentType('new'):
			var newContent = Object.assign({}, action.params)
			newContent.isDirty = false
			newContent.temp_content_id = new Date().getTime()
			return Object.assign({}, state, {
				item: {
					...state.item,
					content: [
						...state.item.content.slice(0, action.params.index),
						newContent,
						...state.item.content.slice(action.params.index)
					]
				}
			})

		case contentType('addRequest'):
		case contentType('updateRequest'):
			var newContent = Object.assign({}, action.params)
			newContent.isSaving = true
			return Object.assign({}, state, {
				item: {
					...state.item,
					content: [
						...state.item.content.slice(0, action.params.index),
						newContent,
						...state.item.content.slice(action.params.index + 1)
					]
				}
			})

		case contentType('updateSuccess'):
		case contentType('addSuccess'):
			var newContent = Object.assign({}, action.response, state.item.content[action.params.index])
			newContent.isDirty = false
			newContent.isSaving = false
			return Object.assign({}, state, {
				item: {
					...state.item,
					content: [
						...state.item.content.slice(0, action.params.index),
						newContent,
						...state.item.content.slice(action.params.index + 1)
					]
				}
			})

		case contentType('removeRequest'):
			return Object.assign({}, state, {
				item: {
					...state.item,
					content: [
						...state.item.content.slice(0, action.params.index),
						...state.item.content.slice(action.params.index + 1)						
					]
				}
			})
			return state

		case contentType('setField'):
			var newContent = Object.assign({}, state.item.content[action.index])
			newContent.data[action.field] = action.value
			newContent.isDirty = true
			return Object.assign({}, state, { 
				item: {
					...state.item,
					content: [
						...state.item.content.slice(0, action.index),
						newContent,
						...state.item.content.slice(action.index + 1)
					]
				}
			})

		default:
			return state
	}
}