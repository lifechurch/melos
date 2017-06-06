import Immutable from 'immutable'
import type from '../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('bibleChapterRequest'): {
			const { isParallel } = action.extras
			if (!isParallel) {
				return Immutable.fromJS(state).merge({ loading: true }).toJS()
			}
			return state
		}

		case type('bibleChapterFailure'): {
			const { isParallel } = action.extras
			if (!isParallel) {
				return Immutable.fromJS(state).merge({ loading: false, errors: true, reference: { usfm: null } }).toJS()
			}
			return state
		}

		case type('bibleChapterSuccess'): {
			const { isParallel } = action.extras
			if (!isParallel) {
				const chapter = Immutable.fromJS(action.response).delete('audio').toJS()
				chapter.reference.usfm = chapter.reference.usfm[0]
				if (chapter.previous) {
					chapter.previous.usfm = chapter.previous.usfm[0]
				}
				if (chapter.next) {
					chapter.next.usfm = chapter.next.usfm[0]
				}
				chapter.errors = false
				return Immutable.fromJS(chapter).set('showError', (action.extras && action.extras.showError) || false).toJS()
			}
			return state
		}

		default: {
			return state
		}
	}
}
