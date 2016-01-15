import keyMirror from 'keymirror'

export const Actions = keyMirror({
	OPEN_MODAL: null,
	CLOSE_MODAL: null
})

export const ActionCreators = {
	openModal(key) {
		return {
			type: Actions.OPEN_MODAL,
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