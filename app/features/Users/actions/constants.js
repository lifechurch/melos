const constants = {
	usersViewRequest: 'USERS_VIEW_REQUEST',
	usersViewSuccess: 'USERS_VIEW_SUCCESS',
	usersViewFailure: 'USERS_VIEW_FAILURE',
}

export default function (key) {
	if (typeof key === 'string' && constants.hasOwnProperty(key)) {
		return constants[key];
	} else {
		throw new Error(`Invalid Plan Discovery Action: ${key}`)
	}
}
