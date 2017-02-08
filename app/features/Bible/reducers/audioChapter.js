import Immutable from 'immutable'
import type from '../actions/constants'
import arrayToObject from '../../../lib/arrayToObject'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('audiobibleChapterRequest'):
			return { loading: true, readyToPlay: false }

		case type('audiobibleChapterSuccess'):
			console.log(action);
			if (typeof action.response.audio !== 'undefined' && Array.isArray(action.response.audio)) {
				// const audio = action.response.audio[0]
				return state
				// return Immutable.fromJS(audio).mergeDeep({ loading: false, copyright: action.response.copyright }).toJS()
			} else {
				return { loading: false }
			}

		default:
			return state
	}
}
