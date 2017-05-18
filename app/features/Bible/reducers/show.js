import Immutable from 'immutable'
import type from '../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('bibleChapterRequest'): {
			const { isParallel } = action.extras
			if (!isParallel) {
				return {
					audio: false,
					next: false,
					prev: false,
					parallel: false
				}
			}
			return state
		}

		case type('bibleChapterFailure'):
			return state

		case type('bibleChapterSuccess'): {
			const { isParallel } = action.extras
			if (!isParallel) {
				const audio = (typeof action.response.audio !== 'undefined')
				const next = (typeof action.response.next !== 'undefined')
				const prev = (typeof action.response.previous !== 'undefined')
				return Immutable.fromJS(state).mergeDeep({ audio, next, prev }).toJS()
			}
			return state
		}

		default:
			return state
	}
}
