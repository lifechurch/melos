import { Actions, ActionCreators } from '../actions/loc'

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

		case Actions.REMOVE:
			return state

		case Actions.EDIT:
			return state

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
				latitude: action.place.geometry.loc.lat(),
				longitude: action.place.geometry.loc.lng(),
				formatted_address: action.place.formatted_address,
				google_place_id: action.place.place_id,
				region: parsePlaceFor('administrative_area_level_1', action.place),
				postal_code: parsePlaceFor('postal_code', action.place),
				place: action.place
			}
			return Object.assign({}, state, newLoc)
			

		case Actions.TIMEZONE_SUCCESS:
			return Object.assign({}, state, action.loc)

		case Actions.TIMEZONE_FAILURE:
			var loc = Object.assign({}, state, { hasError: true, error: action.error })
			return Object.assign({}, state, loc)

		case Actions.ADD_TIME:
			return state

		case Actions.SAVE:
			return state

		default:
			return state
			
	}
}