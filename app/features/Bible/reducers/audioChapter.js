import Immutable from 'immutable'
import type from '../actions/constants'
import arrayToObject from '../../../lib/arrayToObject'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('audiobibleChapterRequest'):
			return { loading: true, readyToPlay: false }

		case type('audiobibleChapterSuccess'):
			if (typeof action.response.chapter !== 'undefined') {
				const audio = action.response.chapter[0]
				return Immutable.fromJS(state).merge({ [action.params.reference]: audio }).toJS()
			} else {
				return { loading: false }
			}

		default:
			return state
	}
}
