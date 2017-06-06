import keyMirror from 'keymirror'

export const Actions = keyMirror({
	OPEN_MODAL: null,
	CLOSE_MODAL: null
})

export const ActionCreators = {
	openModal(key, data = {}) {
		return {
			type: Actions.OPEN_MODAL,
			data,
			key
		}
	},

	closeModal(key) {
		return {
			type: Actions.CLOSE_MODAL,
			key
		}
	}
}