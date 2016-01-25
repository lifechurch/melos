const constants = {
	cancel: 'EVENT_CANCEL',
	new: 'EVENT_NEW',
	viewRequest: 'EVENT_VIEW_REQUEST',
	viewSuccess: 'EVENT_VIEW_SUCCESS',
	viewFailure: 'EVENT_VIEW_FAILURE',	
	createRequest: 'EVENT_CREATE_REQUEST',
	createSuccess: 'EVENT_CREATE_SUCCESS',
	createFailure: 'EVENT_CREATE_FAILURE',
	updateRequest: 'EVENT_UPDATE_REQUEST',
	updateSuccess: 'EVENT_UPDATE_SUCCESS',
	updateFailure: 'EVENT_UPDATE_FAILURE',	
	setDetails: 'EVENT_SET_DETAILS'
}

export default function (key) {
	if (typeof key === 'string' && constants.hasOwnProperty(key)) {
		return constants[key];
	} else {
		throw new Error('Invalid Details Action: ' + key)
	}	
}
