const constants = {
	changeLanguageRequest: 'CHANGE_LANGUAGE_REQUEST',
	changeLanguageSuccess: 'CHANGE_LANGUAGE_SUCCESS',
	changeLanguageFailure: 'CHANGE_LANGUAGE_FAILURE'
}

export default function (key) {
	if (typeof key === 'string' && constants.hasOwnProperty(key)) {
		return constants[key];
	} else {
		throw new Error('Invalid Language Action: ' + key)
	}
}
