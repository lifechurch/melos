import type from './constants'
import { toApiFormat } from '../transformers/location'

const ActionCreators = {

	add(params) {
		return {
			type: type('add'),
			...params
		}
	},

	cancelEdit() {
		return {
			type: type('cancelEdit')
		}
	},

	setField(field, value) {
		return {
			type: type('setField'),
			field,
			value
		}
	},

	setPlace(place) {
		return {
			type: type('setPlace'),
			place
		}
	},

	setTime(index, start_dt, end_dt) {
		return {
			type: type('setTime'),
			index,
			start_dt,
			end_dt
		}
	},

	addTime() {
		return {
			type: type('addTime')
		}
	},

	removeTime(index) {
		return {
			type: type('removeTime'),
			index
		}
	},

	view(location_id, originalLoc = {}, initiatedByEdit = false) {
		return {
			initiatedByEdit,
			originalLoc,
			api_call: {
				endpoint: 'events',
				method: 'view_location',
				version: '3.2',
				auth: true,
				params: { location_id },
				http_method: 'get',
				types: [ type('viewRequest'), type('viewSuccess'), type('viewFailure') ]
			}
		}
	},

	items() {
		return {
			api_call: {
				endpoint: 'events',
				method: 'locations_items',
				version: '3.2',
				auth: true,
				params: {},
				http_method: 'get',
				types: [ type('itemsRequest'), type('itemsSuccess'), type('itemsFailure') ]
			}
		}
	},

	edit(originalLoc) {
		return dispatch => {
			const { id } = originalLoc
			if (typeof id === 'number') {
				dispatch(ActionCreators.view(id, originalLoc, true)).then((fetchedLoc) => {
					const { google_place_id } = fetchedLoc
					if (typeof google_place_id === 'string') {
						dispatch(ActionCreators.getPlace(google_place_id, fetchedLoc, true)).then((fetchedPlace) => {
							dispatch({
								type: type('editSuccess'),
								originalLoc,
								loc: fetchedLoc,
								place: fetchedPlace
							})
						}, (error) => {
							dispatch({
								type: type('editFailure'),
								originalLoc,
								loc: fetchedLoc,
								place: false,
								error
							})
						})
					} else {
						dispatch({
							type: type('editSuccess'),
							originalLoc,
							loc: fetchedLoc,
							place: false
						})
					}
				}, (error) => {
					dispatch({
						type: type('editFailure'),
						originalLoc,
						loc: false,
						place: false,
						error
					})
				})
			}
		}
	},

	create(eventId, loc) {
		const newLoc = toApiFormat(Object.assign({}, loc, { eventId }))
		return {
			loc,
			api_call: {
				endpoint: 'events',
				method: 'create_location',
				version: '3.2',
				auth: true,
				params: newLoc,
				http_method: 'post',
				types: [ type('createRequest'), type('createSuccess'), type('createFailure') ]
			}
		}
	},

	delete(id) {
		return {
			locationId: id,
			api_call: {
				endpoint: 'events',
				method: 'delete_location',
				version: '3.2',
				auth: true,
				params: { id },
				http_method: 'post',
				types: [ type('deleteRequest'), type('deleteSuccess'), type('deleteFailure') ]
			}
		}
	},

	update(eventId, loc) {
		const params = toApiFormat(Object.assign({}, loc, { eventId }))
		return {
			params,
			api_call: {
				endpoint: 'events',
				method: 'update_location',
				version: '3.2',
				auth: true,
				params,
				http_method: 'post',
				types: [ type('updateRequest'), type('updateSuccess'), type('updateFailure') ]
			}
		}
	},

	addLocation(eventId, locationId) {
		const params = { id: eventId, location_id: locationId }
		return {
			locationId,
			api_call: {
				endpoint: 'events',
				method: 'add_location',
				version: '3.2',
				auth: true,
				params,
				http_method: 'post',
				types: [ type('addLocationRequest'), type('addLocationSuccess'), type('addLocationFailure') ]
			}
		}
	},

	removeLocation(eventId, locationId) {
		const params = { id: eventId, location_id: locationId }
		return {
			locationId,
			api_call: {
				endpoint: 'events',
				method: 'remove_location',
				version: '3.2',
				auth: true,
				params,
				http_method: 'post',
				types: [ type('removeLocationRequest'), type('removeLocationSuccess'), type('removeLocationFailure') ]
			}
		}
	},

	choosePlace(place) {
		return dispatch => {
			const { lat, lng } = place.geometry.location
			dispatch(ActionCreators.timezoneRequest(lat(), lng()))
			dispatch(ActionCreators.setPlace(place))
		}
	},

	timezoneRequest(lat, lng) {
		return {
			google_maps_api_call: {
				method: 'getTimezone',
				params: [lat, lng],
				types: [ type('timezoneRequest'), type('timezoneSuccess'), type('timezoneFailure') ]
			}
		}
	},

	getPlace(placeid, originalLoc = {}, initiatedByEdit = false) {
		return {
			initiatedByEdit,
			originalLoc,
			google_maps_api_call: {
				method: 'getPlace',
				params: [placeid],
				types: [ type('placeRequest'), type('placeSuccess'), type('placeFailure') ]
			}
		}
	}

}

export default ActionCreators
