import { getClient } from '@youversion/js-api'
import { handleResponse } from './common'
import { getTimezone } from '../api/GoogleMaps'
import keyMirror from 'keymirror'
import { Actions as ModalActions, ActionCreators as ModalActionCreators } from './modals'
import moment from 'moment'

var EventsApi = getClient('events')

export const Actions = keyMirror({
	ADD: null,
	REMOVE: null,
	EDIT: null,
	SET_FIELD: null,
	SET_PLACE: null,
	TIMEZONE_SUCCESS: null,
	TIMEZONE_FAILURE: null,
	ADD_TIME: null,
	SAVE: null
})

export const ActionCreators = {
	addLoc(loc) {
		return {
			type: Actions.ADD,
			loc
		}
	},

	remove(id) {
		return {
			type: Actions.REMOVE,
			id
		}
	},

	edit(id) {
		return {
			type: Actions.EDIT,
			id
		}
	},

	setField(field, value) {
		return {
			type: Actions.SET_FIELD,
			field,
			value
		}
	},

	setPlace(place) {
		return {
			type: Actions.SET_PLACE,
			place
		}
	},

	timezoneSuccess(timezone) {
		return {
			type: Actions.TIMEZONE_SUCCESS,
			timezone
		}
	},

	timezoneFailure(error) {
		return {
			type: Actions.TIMEZONE_FAILURE,
			error
		}
	},

	timezoneRequest(place) {
		return dispatch => {
			const { lat, lng } = place.geometry.loc
			return getTimezone(lat(), lng()).then(function(timezone) {
				dispatch(ActionCreators.timezoneSuccess(timezone))
			}, function(error) {
				dispatch(ActionCreators.timezoneFailure(error))
			})
		}
	},

	choosePlace(place) {
		return dispatch => {
			dispatch(ActionCreators.setPlace(place))
			dispatch(ActionCreators.timezoneRequest(place))
		}		
	},

	addVirtual() {
		return dispatch => {
			var emptyLoc = { 
				type: 'virtual',
				times: [
					{ start_dt: moment(), end_dt: moment() }
				]
			}
			dispatch(ActionCreators.addLoc(emptyLoc))
		}
	},

	addPhysical() {
		return dispatch => {
			var emptyLoc = {
				type: 'physical',
				times: [
					{ start_dt: moment(), end_dt: moment() }
				]
			}
			dispatch(ActionCreators.addLoc(emptyLoc))
		}
	}	
}