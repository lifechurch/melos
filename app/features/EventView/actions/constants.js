const constants = {
	editNote: 'EDIT_NOTE',
	saveNoteRequest: 'SAVE_NOTE_REQUEST',
	saveNoteSuccess: 'SAVE_NOTE_SUCCESS',
	saveNoteFailure: 'SAVE_NOTE_FAILURE'
}

export default function (key) {
	if (typeof key === 'string' && constants.hasOwnProperty(key)) {
		return constants[key];
	} else {
		throw new Error('Invalid Location Action: ' + key)
	}
}
