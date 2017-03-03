import Immutable from 'immutable'

import type from '../../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('bibleVersesSuccess'):
			return (function bibleVersesSuccess() {
				const { params: { id, passage }, response: { verses, next_verse, previous_verse } } = action

				if (typeof id !== 'undefined') {
					let version
					if (typeof id !== 'undefined') {
						version = id
					}

					let title,
						human = null
					if (Array.isArray(verses)) {
						title = verses[0].content
						human = verses[0].reference.human
					}

					return Immutable.fromJS(state).mergeDeep({
						version,
						passage,
						title,
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
