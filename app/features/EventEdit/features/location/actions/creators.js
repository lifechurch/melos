import type from './constants'
import { toApiFormat } from '../transformers/location'

const ActionCreators = {

	add(locationType) {
		return {
			type: type('add'),
			locationType
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

	view(location_id, originalLoc = {}, initiatedByEdit = false) {
		return {
			initiatedByEdit,
			originalLoc,
			api_call: {
				endpoint: 'events',
				method: 'view_location',
				version: '3.2',
				env: 'staging',
				auth: {
					user: 'ignacio',
					pass: 'password'
				},
				params: { location_id },
				http_method: 'get',
				types: [ type('viewRequest'), type('viewSuccess'), type('viewFailure') ]
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
								originalLoc: originalLoc,
								loc: fetchedLoc,
								place: fetchedPlace
							})
						}, (error) => {
							dispatch({
								type: type('editFailure'),
								originalLoc: originalLoc,
								loc: fetchedLoc,
								place: false,
								error
							})
						})
					} else {
						dispatch({
							type: type('editSuccess'),
							originalLoc: originalLoc,
							loc: fetchedLoc,
							place: false
						})
					}
				}, (error) => {
					dispatch({
						type: type('editFailure'),
						originalLoc: originalLoc,
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
				env: 'staging',
				auth: {
					user: 'ignacio',
					pass: 'password'
				},
				params: newLoc,
				http_method: 'post',
				types: [ type('createRequest'), type('createSuccess'), type('createFailure') ]
			}
		}
	},

	update(eventId, loc) {
		const newLoc = toApiFormat(Object.assign({}, loc, { eventId }))
		console.log("EDIT", newLoc)
		return {
			api_call: {
				endpoint: 'events',
				method: 'update_location',
				version: '3.2',
				env: 'staging',
				auth: {
					user: 'ignacio',
					pass: 'password'
				},
				params: newLoc,
				http_method: 'post',
				types: [ type('updateRequest'), type('updateSuccess'), type('updateFailure') ]
			}
		}
	},	

	remove(eventId, locationId, index) {
		const params = { id: eventId, location_id: locationId }
		return {
			index,
			api_call: {
				endpoint: 'events',
				method: 'remove_location',
				version: '3.2',
				env: 'staging',
				auth: {
					user: 'ignacio',
					pass: 'password'
				},
				params,
				http_method: 'post',
				types: [ type('removeRequest'), type('removeSuccess'), type('removeFailure') ]
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