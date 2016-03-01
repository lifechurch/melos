import type from '../actions/constants'
import locationType from '../../location/actions/constants'
import contentType from '../../content/actions/constants'
import { validateEventDetails } from '../validators/details'
import { fromApiFormat as eventFromApiFormat, sortContent } from '../transformers/event'
import defaultState from '../../../../../defaultState'
import { fromApiFormat as locationFromApiFormat } from '../../location/transformers/location'
import { fromApiFormat as contentFromApiFormat } from '../../content/transformers/content'
import arrayToObject from '../../../../../lib/arrayToObject'
import mergeObjects from '../../../../../lib/mergeObjects'
import applyLifecycleRules from '../../../validators/applyLifecycleRules'

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

		case type('publishEventFailure'):
		case type('publishEventRequest'):
		case type('unpublishEventFailure'):
		case type('unpublishEventRequest'):
			return state

		case type('publishEventSuccess'):
		case type('unpublishEventSuccess'):
			return applyLifecycleRules(Object.assign({}, state, {item: {...state.item, status: action.response.status}}))

		case type('cancel'):
			return validateEventDetails(Object.assign({}, defaultState.event))

		case type('new'):
			return applyLifecycleRules(validateEventDetails(Object.assign({}, defaultState.event)))

		case type('viewSuccess'):
			return applyLifecycleRules(eventFromApiFormat(Object.assign({}, state, { item: action.response, isFetching: false, isSaving: false, isDirty: false })))

		case type('viewFailure'):
			return validateEventDetails(Object.assign({}, state, { isFetching: false, isSaving: false, isDirty: false, api_errors: action.api_errors }))

		case type('viewRequest'):
			return Object.assign({}, state, { errors: { fields: {} }, isFetching: true, isSaving: false, isDirty: false })

		case type('createSuccess'):
			return applyLifecycleRules(validateEventDetails(eventFromApiFormat(Object.assign({}, state, { item: action.response, isFetching: false, isSaving: false, isDirty: false }))))

		case type('createFailure'):
			return validateEventDetails(Object.assign({}, state, { isFetching: false, isSaving: false, isDirty: false, api_errors: action.api_errors }))

		case type('updateRequest'):
			return validateEventDetails(Object.assign({}, state, { isFetching: false, isSaving: true, isDirty: false }))

		case type('updateSuccess'):
			return applyLifecycleRules(validateEventDetails(Object.assign({}, state,
				{
					item: action.response,
					isFetching: false,
					isSaving: false,
					isDirty: false,
					api_errors: null
				}
			)))

		case type('updateFailure'):
			//hasError: true, errors: action.error.errors,
			return validateEventDetails(Object.assign({}, state,
				{
					isFetching: false,
					isSaving: false,
					isDirty: false,
					api_errors: action.api_errors
				}
			))

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

		case locationType('addLocationRequest'):
			return applyLifecycleRules(validateEventDetails(Object.assign({}, state, {
				item: {
					...state.item,
					locations: selectLocation(Object.assign({}, state.item.locations), action.locationId, true)
				}
			})))

		case locationType('deleteRequest'):
			const eLocs  = state.item.locations
			delete eLocs[action.locationId]
			return applyLifecycleRules(validateEventDetails(Object.assign({}, state, {
				item: {
					...state.item,
					locations: eLocs
				}
			})))

		case locationType('removeLocationRequest'):
			return applyLifecycleRules(validateEventDetails(Object.assign({}, state, {
				item: {
					...state.item,
					locations: selectLocation(Object.assign({}, state.item.locations), action.locationId, false)
				}
			})))

		case locationType('updateRequest'):
			var { params } = action
			var newParams = Object.assign({}, params, { id: params.location_id })
			return applyLifecycleRules(Object.assign({}, state, {
				item: {
					...state.item,
					locations: {
						...state.item.locations,
						[newParams.id]: Object.assign(
							{},
							state.item.locations[newParams.id],
							newParams,
							{'original': Object.assign({}, state.item.locations[newParams.id])}
						)
					}
				}
			}))

		case locationType('updateFailure'):
			var { params } = action
			return applyLifecycleRules(Object.assign({}, state, {
				item: {
					...state.item,
					locations: {
						...state.item.locations,
						[params.location_id]: Object.assign(
							{},
							state.item.locations[params.location_id].original
						)
					}
				}
			}))

		case locationType('createSuccess'):
			const { locations } = state.item
			return applyLifecycleRules(validateEventDetails(Object.assign({}, state, {
				item: {
					...state.item,
					locations: {
						...locations,
						[action.response.id]: locationFromApiFormat(Object.assign({}, action.loc, action.response, { isSelected: true }))
					}
				}
			})))

		case locationType('itemsSuccess'):
			const allLocations = arrayToObject(action.response.locations.map((location) => {
				return {
					...location,
					times: [],
					isSelected: false
				}
			}), 'id')

			var locations = mergeObjects(allLocations, state.item.locations)

			return applyLifecycleRules(Object.assign({}, state, {
				item: { ...state.item, locations }
			}))

		case contentType('new'):
			var newContent = Object.assign({}, action.params)
			newContent.isDirty = false
			newContent.temp_content_id = new Date().getTime()
			newContent.errors = {}
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
			if (newContent.errors && newContent.errors.update) {
				delete newContent.errors['update']
			}
			return applyLifecycleRules(Object.assign({}, state, {
				item: {
					...state.item,
					content: [
						...state.item.content.slice(0, action.params.index),
						newContent,
						...state.item.content.slice(action.params.index + 1)
					]
				}
			}))

		case contentType('chapterRequest'):
			var newContent = Object.assign({}, state.item.content[action.params.index])
			if (newContent.errors && newContent.errors.chapter) {
				delete newContent.errors['chapter']
			}
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

		case contentType('chapterSuccess'):
			var newContent = Object.assign({}, state.item.content[action.params.index])
			newContent.data.chapter = action.response.content
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

		case contentType('chapterFailure'):
			var newContent = Object.assign({}, state.item.content[action.params.index])
			newContent.data.chapter = ''
			newContent.errors = Object.assign({}, {...newContent.errors}, {'chapter': action.api_errors})

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

		case contentType('chapterClear'):
			var newContent = Object.assign({}, state.item.content[action.params.index])
			newContent.data.chapter = ''
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

		case contentType('versionRequest'):
			var newContent = Object.assign({}, state.item.content[action.params.index])
			newContent.isDirty = true
			newContent.isFetching = true
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

		case contentType('versionSuccess'):
			var newContent = Object.assign({}, state.item.content[action.params.index])
			newContent.data.version_id = action.params.id
			newContent.isFetching = false
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

		case contentType('setReference'):
			var newContent = Object.assign({}, state.item.content[action.index])
			newContent.data.usfm = action.usfm
			newContent.data.human = action.human
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

		case contentType('clearReference'):
			var newContent = Object.assign({}, state.item.content[action.index])
			newContent.data.usfm = ['']
			newContent.data.human = " "

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

		case contentType('updateSuccess'):
		case contentType('addSuccess'):
			var newContent = Object.assign({}, action.response, state.item.content[action.params.index])

			if (action.response.type == 'reference') {
				newContent.data.usfm = action.response.data.usfm
				newContent.data.human = action.response.data.human
			}

			newContent.isDirty = false
			newContent.isSaving = false
			return applyLifecycleRules(Object.assign({}, state, {
				item: {
					...state.item,
					content: [
						...state.item.content.slice(0, action.params.index),
						newContent,
						...state.item.content.slice(action.params.index + 1)
					]
				}
			}))

		case contentType('updateFailure'):
			var newContent = Object.assign({}, action.response, state.item.content[action.params.index])
			newContent.errors = Object.assign({}, {...newContent.errors}, {'update': action.api_errors})

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
			return applyLifecycleRules(Object.assign({}, state, {
				item: {
					...state.item,
					content: [
						...state.item.content.slice(0, action.params.index),
						...state.item.content.slice(action.params.index + 1)
					]
				}
			}))

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

		case contentType('selectPlan'):
			var newContent = Object.assign({}, state.item.content[action.index])
			newContent.data = Object.assign(newContent.data, action.selectedPlan)
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

		case contentType('startReorder'):
			return Object.assign({}, state, { isReordering: true })

		case contentType('reorderRequest'):
			return Object.assign({}, state, { isReordering: false })

		case contentType('move'):
			const { fromIndex, toIndex } = action

			var _content = [
				...state.item.content.slice(0)
			]

			_content[fromIndex].sort = toIndex * 100
			_content[toIndex].sort += (fromIndex - toIndex) * 50

			var content = sortContent(_content)
			return Object.assign({}, state, {
				item: {
					...state.item,
					content
				}
			})

		case contentType('initUploadSuccess'):
			var newContent = Object.assign({}, state.item.content[action.params.index])
			newContent.data.image_id = action.response.image_id
			newContent.data.url = action.response.url
			newContent.data.params = action.response.params
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

		default:
			return state
	}
}
