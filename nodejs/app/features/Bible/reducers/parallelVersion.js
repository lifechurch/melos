import Immutable from 'immutable'
import type from '../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('bibleVersionRequest'): {
			const { isParallel } = action.extras
			if (isParallel) {
				return Immutable.fromJS(state).merge({ loading: true }).toJS()
			}
			return state
		}

		case type('bibleVersionFailure'): {
			const { isParallel } = action.extras
			if (isParallel) {
				return { loading: false }
			}
			return state
		}

		case 'BIBLE__VERSION__SUCCESS':
		case type('bibleVersionSuccess'): {
			const { isParallel } = action.extras
			if (isParallel) {
				return Immutable.fromJS(action.response).set('loading', false).delete('books').toJS()
			}
			return state
		}

		default: {
			return state
		}
	}
}
