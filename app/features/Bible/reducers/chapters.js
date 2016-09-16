import type from '../actions/constants'
import Immutable from 'immutable'

export default function reducer(state = {}, action) {
	switch (action.type) {
		// case type('bibleVersionRequest'):
		// 	return { loading: true }

		// case type('bibleVersionFailure'):
		// 	return { loading: false }

		// case type('bibleVersionSuccess'):
		// 	if (typeof action.response.chapters !== 'undefined') {
		// 		return Immutable.fromJS(action.response.chapters)

		// 	} else {
		// 		return { loading: false }
		// 	}


		default:
			return state
	}
}