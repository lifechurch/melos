const constants = {
	cancel: 'EVENT_CANCEL',
	new: 'EVENT_NEW',
	imgUpload: 'IMG_UPLOAD',
	imgUploadSuccess: 'IMG_UPLOAD_SUCCESS',
	imgUploadFailure: 'IMG_UPLOAD_FAILURE',
	viewRequest: 'EVENT_VIEW_REQUEST',
	viewSuccess: 'EVENT_VIEW_SUCCESS',
	viewFailure: 'EVENT_VIEW_FAILURE',
	createRequest: 'EVENT_CREATE_REQUEST',
	createSuccess: 'EVENT_CREATE_SUCCESS',
	createFailure: 'EVENT_CREATE_FAILURE',
	updateRequest: 'EVENT_UPDATE_REQUEST',
	updateSuccess: 'EVENT_UPDATE_SUCCESS',
	updateFailure: 'EVENT_UPDATE_FAILURE',
	publishEventRequest: 'EVENT_PUBLISH_REQUEST',
	publishEventSuccess: 'EVENT_PUBLISH_SUCCESS',
	publishEventFailure: 'EVENT_PUBLISH_FAILURE',
	unpublishEventRequest: 'EVENT_UNPUBLISH_REQUEST',
	unpublishEventSuccess: 'EVENT_UNPUBLISH_SUCCESS',
	unpublishEventFailure: 'EVENT_UNPUBLISH_FAILURE',
	setDetails: 'EVENT_SET_DETAILS'
}

export default function (key) {
	if (typeof key === 'string' && constants.hasOwnProperty(key)) {
		return constants[key];
	} else {
		throw new Error(`Invalid Details Action: ${key}`)
	}
}
