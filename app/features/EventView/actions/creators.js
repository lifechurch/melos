import type from './constants'

const ActionCreators = {

	editNote(index, note) {
		return {
			type: type('editNote'),
			index,
			note
		}
	},

	saveNote(params) {
		return {
			params,
			api_call: {
				endpoint: 'events',
				method: 'save',
				version: '3.2',
				auth: true,
				params: params,
				http_method: 'post',
				types: [ type('saveNoteRequest'), type('saveNoteSuccess'), type('saveNoteFailure') ]
			}
		}
	}

}

export default ActionCreators
