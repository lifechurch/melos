const constants = {
	duplicateRequest: 'EVENT_DUPLICATE_REQUEST',
	duplicateSuccess: 'EVENT_DUPLICATE_SUCCESS',
	duplicateFailure: 'EVENT_DUPLICATE_FAILURE',
	configurationRequest: 'EVENT_CONFIGURATION_REQUEST',
	configurationSuccess: 'EVENT_CONFIGURATION_SUCCESS',
	configurationFailure: 'EVENT_CONFIGURATION_FAILURE',
	deleteRequest: 'EVENT_DELETE_REQUEST',
	deleteSuccess: 'EVENT_DELETE_SUCCESS',
	deleteFailure: 'EVENT_DELETE_FAILURE'
}

export default function (key) {
	if (typeof key === 'string' && constants.hasOwnProperty(key)) {
		return constants[key];
	} else {
		throw new Error(`Invalid \`My Event Feed\` Action: ${key}`)
	}
}
