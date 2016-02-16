const constants = {
	duplicateRequest: 'EVENT_DUPLICATE_REQUEST',
	duplicateSuccess: 'EVENT_DUPLICATE_SUCCESS',
	duplicateFailure: 'EVENT_DUPLICATE_FAILURE'
}

export default function (key) {
	if (typeof key === 'string' && constants.hasOwnProperty(key)) {
		return constants[key];
	} else {
		throw new Error('Invalid `My Event Feed` Action: ' + key)
	}
}
