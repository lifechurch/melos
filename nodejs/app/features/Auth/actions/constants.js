const constants = {
	logout: 'LOGOUT',
	authenticationFailed: 'AUTHENTICATION_FAILED',
	authenticateRequest: 'AUTHENTICATE_REQUEST',
	authenticateSuccess: 'AUTHENTICATE_SUCCESS',
	authenticateFailure: 'AUTHENTICATE_FAILURE',
	checkTokenRequest: 'CHECK_TOKEN_REQUEST',
	checkTokenSuccess: 'CHECK_TOKEN_SUCCESS',
	checkTokenFailure: 'CHECK_TOKEN_FAILURE',
	setField: 'AUTHENTICATE_SET_FIELD'
}

export default function (key) {
	if (typeof key === 'string' && constants.hasOwnProperty(key)) {
		return constants[key];
	} else {
		throw new Error(`Invalid Login Action: ${key}`)
	}
}
