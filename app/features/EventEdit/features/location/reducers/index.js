import type from '../actions/constants'
import moment from 'moment'
import { fromApiFormat } from '../transformers/location'

function parsePlaceFor(type, place) {
	for (var addressComponent of place.address_components) {
		if (addressComponent.types.indexOf(type) > -1) {
			return addressComponent.short_name
		}
	}
}

export default function loc(state = {}, action) {
	switch(action.type) {

		case type('viewSuccess'):
			if (action.initiatedByEdit) {
				return Object.assign({}, state, { isLoading: true }) //fromApiFormat(Object.assign({}, action.loc, action.response))
			} else {
				return fromApiFormat(Object.assign({}, action.originalLoc, action.response))				
			}

		case type('viewFailure'):
			return Object.assign({}, state, { errors: action.errors, hasError: true })

		case type('viewRequest'):
			return Object.assign({}, state, { isLoading: true, hasError: false })

		case type('add'):
			var start_dt = moment().startOf('hour')
			var end_dt = moment(start_dt.toDate().getTime()).add(1, 'h')
			return {
				type: action.locationType,
				times: [
					{ start_dt, end_dt }
				]
			}

		case type('edit'):
			return Object.assign({}, state, action.loc)

		case type('cancelEdit'):
			return {}

		case type('setField'):
			if (['name', 'timezone'].indexOf(action.field) > -1) {
				let item = Object.assign({}, state.item)
				item[action.field] = action.value
				return Object.assign({}, state, item, { isDirty: true })
			} else {
				return state
			}		

		case type('setPlace'):
			var newLoc = {
				city: parsePlaceFor('locality', action.place),
				country: parsePlaceFor('country', action.place),
				latitude: action.place.geometry.location.lat(),
				longitude: action.place.geometry.location.lng(),
				formatted_address: action.place.formatted_address,
				google_place_id: action.place.place_id,
				region: parsePlaceFor('administrative_area_level_1', action.place),
				postal_code: parsePlaceFor('postal_code', action.place),
				place: action.place
			}
			return Object.assign({}, state, newLoc)

		case type('timezoneSuccess'):
			return Object.assign({}, state, { timezone: action.response.timeZoneId })

		case type('timezoneFailure'):
			var loc = Object.assign({}, state, { hasError: true, errors: action.errors })
			return Object.assign({}, state, loc)

		case type('setTime'):
			return Object.assign({}, state, {
				times: [
					...state.times.slice(0, action.index),
					Object.assign({}, state.times[action.index], { start_dt: action.start_dt, end_dt: action.end_dt }),
					...state.times.slice(action.index + 1)
				]
			})

		case type('addTime'):
			const maxIndex = state.times.length - 1
			var start_dt = moment().startOf('hour')
			var end_dt = moment(start_dt.toDate().getTime()).add(1, 'h')
			var new_time = { start_dt, end_dt }
		
			return Object.assign({}, state, {
				times: [
					...state.times,
					new_time
				]
			})		

		case type('save'):
			return state

		case type('createRequest'):
			return Object.assign({}, state, { isSaving: true, hasError: false })

		case type('createSuccess'):
			return fromApiFormat(Object.assign({}, state, action.response))

		case type('createFailure'):
			return Object.assign({}, state, { errors: action.errors, hasError: true })

		case type('removeRequest'):
			return Object.assign({}, state, { isRemoving: true, hasError: false })

		case type('removeSuccess'):
			return {}

		case type('removeFailure'):
			return Object.assign({}, state, { hasError: true, errors: action.errors, isRemoving: false })

		case type('placeSuccess'):
			if (action.initiatedByEdit) {
				return Object.assign({}, state, { isLoading: true }) //hasPlace: true, place: action.response })
			} else {
				return Object.assign({}, state, { hasPlace: true, place: action.response })				
			}

		case type('placeFailure'):
			return Object.assign({}, state, { place: { hasError: true, errors: action.errors } })		

		case type('placeRequest'):
			return Object.assign({}, state, { place: { isLoading: true } })

		case type('editSuccess'):
			return fromApiFormat(Object.assign({}, state, action.originalLoc, action.loc, { place: action.place }))

		case type('editFailure'):
			const originalLoc = action.originalLoc || {}
			const loc = action.loc || {}
			const place = action.place || {}
			return Object.assign({}, state, loc, originalLoc, { place }, { hasError: action.error })

		default:
			return state
			
	}
}