import type from '../actions/constants'
import Immutable from 'immutable'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('bibleChapterRequest'):
			return { loading: true }

		case type('bibleChapterFailure'):
			return { loading: false, errors: true }

		case type('bibleChapterSuccess'):
			const chapter = Immutable.fromJS(action.response).delete('audio').toJS()
			chapter.reference.usfm = chapter.reference.usfm[0]
			if (chapter.previous) {
				chapter.previous.usfm = chapter.previous.usfm[0]
			}
			if (chapter.next) {
				chapter.next.usfm = chapter.next.usfm[0]
			}
			chapter.errors = false
			return Immutable.fromJS(chapter).toJS()

		default:
			return state
	}
}