import type from '../actions/constants'
import Immutable from 'immutable'
import arrayToObject from '../../../lib/arrayToObject'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('bibleChapterRequest'):
			return { loading: true, readyToPlay: false }

		case type('bibleChapterSuccess'):
			if (typeof action.response.audio !== 'undefined' && Array.isArray(action.response.audio)) {
				const audio = action.response.audio[0]
				return Immutable.fromJS(audio).mergeDeep({ loading: false, copyright: action.response.copyright }).toJS()
			} else {
				return { loading: false }
			}

		// case type("audioLoaded"):
		// 	return Immutable.fromJS(state).set('readyToPlay', true).toJS()

		default:
			return state
	}
}
