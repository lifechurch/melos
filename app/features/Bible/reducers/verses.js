import type from '../actions/constants'
import Immutable from 'immutable'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('bibleVersesRequest'):
			return { loading: true }

		case type('bibleVersesFailure'):
			return { loading: false, errors: true, reference: { usfm: null } }

		case type('bibleVersesSuccess'):
			return Immutable.fromJS(action.response).toJS()

		default:
			return state
	}
}