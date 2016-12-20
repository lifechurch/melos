import type from '../actions/constants'
import Immutable from 'immutable'
import { getSelectionString } from '../../../lib/usfmUtils'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('bibleVersesRequest'):
			return { loading: true }

		case type('bibleVersesFailure'):
		case type('passageLoadFailure'):
			return Immutable.fromJS(action).set('loading', false).toJS()

		// case type('bibleVersesSuccess'):
		// this action is dispatched when all the promises resolve
		// for the passageLoad function
		case type('passageLoadSuccess'):
			let content = {}
			let title, previous_verse, next_verse = null
			// this represents every promise from the passageLoad function
			// including some of the plans calls, so we will let the plans reducers handle
			// those and just handle the verse ones here
			action.data.forEach((promise) => {
				// bible verses call
				if ('verses' in promise && 'text' in promise) {
					let usfm = `${promise.verses[0].reference.usfm[0].split('.').slice(0, 2).join('.')}.${getSelectionString(promise.verses[0].reference.usfm)}`
					content[`${promise.versionInfo.id}-${usfm}`] = {
						heading: ``,
						content: promise.verses[0].content,
						chapUsfm: promise.verses[0].reference.usfm[0].split('.').slice(0, 2).join('.'),
						usfm: usfm,
						text: promise.text,
						human: promise.verses[0].reference.human,
						versionInfo: promise.versionInfo,
					}
					if (!title) title = promise.verses[0].reference.human
					if (!next_verse) next_verse = promise.next_verse
					if (!previous_verse) previous_verse = promise.previous_verse
				}
			})

			return Immutable.fromJS(state).mergeDeep({
				primaryVersion: action.primaryVersion,
				versions: action.versions,
				verses: content,
				title: title,
				next_verse: next_verse,
				previous_verse: previous_verse,
			}).delete('loading').toJS()


		default:
			return state
	}
}