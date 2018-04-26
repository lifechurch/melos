const constants = {
	passwordChangeRequest: 'PASSWORD_CHANGE_REQUEST',
	passwordChangeSuccess: 'PASSWORD_CHANGE_SUCCESS',
	passwordChangeFailure: 'PASSWORD_CHANGE_FAILURE',
	passwordSetField: 'PASSWORD_SET_FIELD'
}

export default function (key) {
	if (typeof key === 'string' && constants.hasOwnProperty(key)) {
		return constants[key];
	} else {
		throw new Error(`Invalid Password Change Action: ${key}`)
	}
}
