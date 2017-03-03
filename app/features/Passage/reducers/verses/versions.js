import type from '../../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('bibleVersesSuccess'):
			return (function bibleVersesSuccess() {
				const { params } = action
				if ('ids' in params) {
					return params.ids
				}
				return state
			}())

		default:
			return state
	}
}
