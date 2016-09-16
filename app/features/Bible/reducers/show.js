import type from '../actions/constants'
import Immutable from 'immutable'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('bibleChapterRequest'):
			return {
				audio: false,
				next: false,
				prev: false,
				parallel: false
			}

		case type('bibleChapterFailure'):
			return state

		case type('bibleChapterSuccess'):
			const audio = (typeof action.response.audio !== 'undefined')
			const next = (typeof action.response.next !== 'undefined')
			const prev = (typeof action.response.previous !== 'undefined')
			return Immutable.fromJS(state).mergeDeep({ audio, next, prev }).toJS()

		default:
			return state
	}
}