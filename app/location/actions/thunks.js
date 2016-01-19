import { getClient } from '@youversion/js-api'
import { handleResponse } from './common'
import { getTimezone } from '../api/GoogleMaps'
import keyMirror from 'keymirror'
import moment from 'moment'
import { fetchEventView } from './eventView'

var EventsApi = getClient('events')

	timezoneRequest(place) {
		return dispatch => {
			const { lat, lng } = place.geometry.location
			getTimezone(lat(), lng()).then(function(timezone) {
				dispatch(ActionCreators.timezoneSuccess(timezone))
			}, function(error) {
				dispatch(ActionCreators.timezoneFailure(error))
			})
		}
	},


	choosePlace(place) {
		//console.log("Your place was chosen")
		return dispatch => {
			dispatch(ActionCreators.timezoneRequest(place))
			dispatch(ActionCreators.setPlace(place))
		}		
	},


	addVirtual() {
		return dispatch => {
			var emptyLoc = { 
				type: 'virtual',
				times: [
					{ start_dt: moment(), end_dt: moment().add(1, 'h') }
				]
			}
			dispatch(ActionCreators.addLoc(emptyLoc))
		}
	},


	addPhysical() {
		return dispatch => {
			var start_dt = moment().startOf('hour')
			var end_dt = moment(start_dt.toDate().getTime()).add(1, 'h')
			var emptyLoc = {
				type: 'physical',
				times: [
					{ start_dt, end_dt }
				]
			}
			dispatch(ActionCreators.addLoc(emptyLoc))
		}
	},


	remove(eventId, locationId) {
		return dispatch => {
			dispatch(ActionCreators.removeRequest(eventId, locationId))
			return EventsApi
				.call("remove_location")
				.setVersion("3.2")
				.setEnvironment("staging")
				.auth('ignacio', 'password')
				.params({id:eventId, location_id: locationId})
				.post()
				.then((data) => {
					handleResponse(data).then((data) => {
						dispatch(ActionCreators.removeSuccess(eventId, locationId))
						dispatch(fetchEventView(eventId))
					}, (error) => {
						dispatch(ActionCreators.removeFailure(error))
					})
				}, (error) => {
					dispatch(ActionCreators.removeFailure(error))
				})
		}
	},

	create(eventId, loc) {
		return dispatch => {
			var times = loc.times.map((t) => {
				return { 
					start_dt: t.start_dt.format('YYYY-MM-DDTHH:mm:ssZ'), 
					end_dt: t.end_dt.format('YYYY-MM-DDTHH:mm:ssZ')
				}
			})

			var newLocation = {
				id: eventId,
				name: loc.name,
				type: loc.type,
				timezone: loc.timezone,
				city: loc.city,
				country: loc.country,
				latitude: loc.latitude,
				longitude: loc.longitude,
				formatted_address: loc.formatted_address,
				google_place_id: loc.google_place_id,
				region: loc.region,
				postal_code: loc.postal_code,
				times: times 
			}

			dispatch(ActionCreators.createRequest(newLocation))

			return EventsApi
				.call("create_location")
				.setVersion("3.2")
				.setEnvironment("staging")
				.auth('ignacio', 'password')
				.params(newLocation)
				.post()
				.then(function(data) {
					handleResponse(data).then((data) => {
						dispatch(ActionCreators.createSuccess(data))
					}, (error) => {
						dispatch(ActionCreators.createFailure(error))
					})
				}, function(error) {
					dispatch(ActionCreators.createFailure(error))
				})
		}
	},
