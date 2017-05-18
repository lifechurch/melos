import Immutable from 'immutable'
import type from '../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('bibleChapterRequest'): {
			const { isParallel } = action.extras
			if (!isParallel) {
				return { loading: true, readyToPlay: false }
			}
			return state
		}

		case type('bibleChapterSuccess'): {
			const { isParallel } = action.extras
			if (!isParallel) {
				if (typeof action.response.audio !== 'undefined' && Array.isArray(action.response.audio)) {
					const audio = action.response.audio[0]
					return Immutable.fromJS(audio).mergeDeep({ loading: false, copyright: action.response.copyright }).toJS()
				} else {
					return { loading: false }
				}
			}
			return state
		}

		default:
			return state
	}
}
