const constants = {
	authenticateRequest: 'AUTHENTICATE_REQUEST',
	authenticateSuccess: 'AUTHENTICATE_SUCCESS',
	authenticateFailure: 'AUTHENTICATE_FAILURE',
	setField: 'AUTHENTICATE_SET_FIELD'
}

export default function (key) {
	if (typeof key === 'string' && constants.hasOwnProperty(key)) {
		return constants[key];
	} else {
		throw new Error('Invalid Login Action: ' + key)
	}
}
