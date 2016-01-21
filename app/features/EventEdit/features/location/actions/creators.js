import type from './constants'
import { toApiFormat, fromApiFormat } from '../transformers/location'

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
	
	edit(loc) {
		var newLoc = fromApiFormat(Object.assign({}, loc))
		return {
			type: type('edit'),
			loc: newLoc
		}
	},

	create(eventId, loc) {
		const newLoc = toApiFormat(Object.assign({}, loc, { eventId }))
		return {
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

	remove(eventId, locationId) {
		const params = { eventId, locationId }
		return {
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
	}

}

export default ActionCreators