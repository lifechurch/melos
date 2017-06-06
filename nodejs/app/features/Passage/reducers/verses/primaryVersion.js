import Immutable from 'immutable'

import type from '../../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('selectPrimaryVersion'):
			return (function selectPrimaryVersion() {
				return Immutable
						.fromJS(state)
						.set('version', action.version)
						.toJS()
			}())

		case type('bibleVersesRequest'):
			return (function bibleVersesRequest() {
				const { params: { ids }, extras: { passage } } = action
				if (Array.isArray(ids) && ids.length > 0) {
					return Immutable
						.fromJS(state)
						.set('version', ids[0])
						.set('passage', passage)
						.toJS()
				}
				return state
			}())

		default:
			return state
	}
}
