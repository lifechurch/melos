const constants = {
	changeLanguageRequest: 'CHANGE_LANGUAGE_REQUEST',
	changeLanguageSuccess: 'CHANGE_LANGUAGE_SUCCESS',
	changeLanguageFailure: 'CHANGE_LANGUAGE_FAILURE',
	getUserRequest: 'GET_USER_REQUEST',
	getUserSuccess: 'GET_USER_SUCCESS',
	getUserFailure: 'GET_USER_FAILURE',
	updateUserRequest: 'UPDATE_USER_REQUEST',
	updateUserSuccess: 'UPDATE_USER_SUCCESS',
	updateUserFailure: 'UPDATE_USER_FAILURE'
}

export default function (key) {
	if (typeof key === 'string' && constants.hasOwnProperty(key)) {
		return constants[key];
	} else {
		throw new Error(`Invalid Language Action: ${key}`)
	}
}
