import Immutable from 'immutable'

import type from '../../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('bibleVersesSuccess'):
			return (function bibleVersesSuccess() {
				const {
					params: {
						id: version,
						passage
					},
					response: {
						verses,
						next_verse,
						previous_verse
					}
				} = action

				if (typeof version !== 'undefined') {
					let text, human = null
					if (Array.isArray(verses)) {
						text = verses[0].content
						human = verses[0].reference.human
					}

					return Immutable.fromJS(state).mergeDeep({
						version,
						passage,
						text,
						human,
						nextVerse: next_verse,
						previousVerse: previous_verse
					}).toJS()
				}

				return state
			}())

		default:
			return state
	}
}
