import { Actions, ActionCreators } from '../actions/loc'
import moment from 'moment'

function parsePlaceFor(type, place) {
	for (var addressComponent of place.address_components) {
		if (addressComponent.types.indexOf(type) > -1) {
			return addressComponent.short_name
		}
	}
}

export function loc(state = {}, action) {
	switch(action.type) {

		case Actions.ADD:
			return Object.assign({}, state, action.loc)

		case Actions.EDIT:
			return Object.assign({}, state, action.loc)

		case Actions.CANCEL_EDIT:
			return {}

		case Actions.SET_FIELD:
			if (['name'].indexOf(action.field) > -1) {
				let item = Object.assign({}, state.item)
				item[action.field] = action.value
				return Object.assign({}, state, item, { isDirty: true })
			} else {
				return state
			}		

		case Actions.SET_PLACE:
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
			console.log("Place is set")
			return Object.assign({}, state, newLoc)
			

		case Actions.TIMEZONE_SUCCESS:
			return Object.assign({}, state, { timezone: action.timezone.timeZoneId })

		case Actions.TIMEZONE_FAILURE:
			var loc = Object.assign({}, state, { hasError: true, error: action.error })
			return Object.assign({}, state, loc)

		case Actions.SET_TIME:
			return Object.assign({}, state, {
				times: [
					...state.times.slice(0, action.index),
					Object.assign({}, state.times[action.index], { start_dt: action.start_dt, end_dt: action.end_dt }),
					...state.times.slice(action.index + 1)
				]
			})

		case Actions.ADD_TIME:
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

		case Actions.SAVE:
			return state

		case Actions.CREATE_REQUEST:
			return Object.assign({}, state, { isSaving: true, hasError: false })

		case Actions.CREATE_SUCCESS:
			return Object.assign({}, state, action.loc, { hasError: false })

		case Actions.CREATE_FAILURE:
			return Object.assign({}, state, { error: action.error, hasError: true })

		case Actions.REMOVE_REQUEST:
			return Object.assign({}, state, { isRemoving: true, hasError: false })

		case Actions.REMOVE_SUCCESS:
			return {}

		case Actions.REMOVE_FAILURE:
			return Object.assign({}, state, { hasError: true, error: action.error, isRemoving: false })

		default:
			return state
			
	}
}