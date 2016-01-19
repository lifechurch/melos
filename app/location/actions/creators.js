	addLoc(loc) {
		return {
			type: Actions.ADD,
			loc
		}
	},

	cancelEdit() {
		return {
			type: Actions.CANCEL_EDIT
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

	setTime(index, start_dt, end_dt) {
		return {
			type: Actions.SET_TIME,
			index, 
			start_dt,
			end_dt
		}
	},

	addTime() {
		return {
			type: Actions.ADD_TIME
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

	createRequest(loc) {
		return {
			type: Actions.CREATE_REQUEST,
			loc
		}
	},

	createSuccess(loc) {
		return {
			type: Actions.CREATE_SUCCESS,
			loc
		}
	},

	createFailure(error) {
		return {
			type: Actions.CREATE_FAILURE,
			error
		}
	},


	removeRequest(eventId, locationId) {
		return {
			type: Actions.REMOVE_REQUEST,
			eventId,
			locationId
		}
	},

	removeSuccess(eventId, locationId) {
		return {
			type: Actions.REMOVE_SUCCESS,
			eventId,
			locationId
		}
	},

	removeFailure(error) {
		return {
			type: Actions.REMOVE_FAILURE,
			error
		}
	},

	
	edit(loc) {
		return {
			type: Actions.EDIT,
			loc
		}
	}
}