import type from '../actions/constants'

export default function configuration(state = {}, action) {
	switch (action.type) {

		case type('passwordSetField'):
			const { name, value } = action.params
			if (['newPassword', 'newPasswordVerify'].indexOf(name) > -1) {
				const item = Object.assign({}, state.Password)
				item[name] = value
				return Object.assign({}, state, item)
			} else {
				return state
			}

		default:
			return state
	}
}
