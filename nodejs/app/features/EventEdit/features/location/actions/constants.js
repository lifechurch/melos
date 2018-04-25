const constants = {
	add: 'LOCATION_ADD',
	viewRequest: 'LOCATION_VIEW_REQUEST',
	viewSuccess: 'LOCATION_VIEW_SUCCESS',
	viewFailure: 'LOCATION_VIEW_FAILURE',
	removeLocationRequest: 'LOCATION_REMOVE_REQUEST',
	removeLocationSuccess: 'LOCATION_REMOVE_SUCCESS',
	removeLocationFailure: 'LOCATION_REMOVE_FAILURE',
	addLocationRequest: 'LOCATION_ADD_REQUEST',
	addLocationSuccess: 'LOCATION_ADD_SUCCESS',
	addLocationFailure: 'LOCATION_ADD_FAILURE',
	editSuccess: 'LOCATION_EDIT_SUCCESS',
	editFailure: 'LOCATION_EDIT_FAILURE',
	edit: 'LOCATION_EDIT',
	cancelEdit: 'LOCATION_CANCEL_EDIT',
	setField: 'LOCATION_SET_FIELD',
	setPlace: 'LOCATION_SET_PLACE',
	timezoneSuccess: 'LOCATION_TIMEZONE_SUCCESS',
	timezoneFailure: 'LOCATION_TIMEZONE_FAILURE',
	timezoneRequest: 'LOCATION_TIMEZONE_REQUEST',
	placeSuccess: 'LOCATION_PLACE_SUCCESS',
	placeFailure: 'LOCATION_PLACE_FAILURE',
	placeRequest: 'LOCATION_PLACE_REQUEST',
	setTime: 'LOCATION_SET_TIME',
	addTime: 'LOCATION_ADD_TIME',
	removeTime: 'LOCATION_REMOVE_TIME',
	save: 'LOCATION_SAVE',
	createRequest: 'LOCATION_CREATE_REQUEST',
	createSuccess: 'LOCATION_CREATE_SUCCESS',
	createFailure: 'LOCATION_CREATE_FAILURE',
	deleteRequest: 'LOCATION_DELETE_REQUEST',
	deleteSuccess: 'LOCATION_DELETE_SUCCESS',
	deleteFailure: 'LOCATION_DELETE_FAILURE',
	updateRequest: 'LOCATION_UPDATE_REQUEST',
	updateSuccess: 'LOCATION_UPDATE_SUCCESS',
	updateFailure: 'LOCATION_UPDATE_FAILURE',
	itemsRequest: 'LOCATIONS_ITEMS_REQUEST',
	itemsSuccess: 'LOCATIONS_ITEMS_SUCCESS',
	itemsFailure: 'LOCATIONS_ITEMS_FAILURE'
}

export default function (key) {
	if (typeof key === 'string' && constants.hasOwnProperty(key)) {
		return constants[key];
	} else {
		throw new Error(`Invalid Location Action: ${key}`)
	}
}