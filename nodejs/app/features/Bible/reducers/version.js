import Immutable from 'immutable'
import type from '../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('bibleVersionRequest'): {
			const { isParallel } = action.extras
			if (!isParallel) {
				return {
					...state,
					loading: true
				}
			}
			return state
		}

		case type('bibleVersionFailure'): {
			const { isParallel } = action.extras
			if (!isParallel) {
				return { loading: false }
			}
			return state
		}

		case 'BIBLE__VERSION__SUCCESS':
		case type('bibleVersionSuccess'): {
			const { isParallel } = action.extras
			if (!isParallel) {
				return {
					...action.response,
					loading: false,
					books: null
				}
			}
			return state
		}

		default: {
			return state
		}
	}
}
