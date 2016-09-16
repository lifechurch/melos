import type from '../actions/constants'
import Immutable from 'immutable'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('bibleVersionRequest'):
			return { loading: true }

		case type('bibleVersionFailure'):
			return { loading: false }

		case type('bibleVersionSuccess'):
			return Immutable.fromJS(action.response).set('loading', false).delete('books').toJS()

		default:
			return state
	}
}