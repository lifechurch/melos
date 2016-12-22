import type from '../actions/constants'
import Immutable from 'immutable'
import { getSelectionString } from '../../../lib/usfmUtils'

export default function reducer(state = {}, action) {
	switch (action.type) {
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
					content[`${promise.versionInfo.id}-${promise.usfm}`] = {
						heading: ``,
						// concat all the content for each verse together
						content: promise.verses.reduce((acc, curr) => { return acc + curr.content }, ''),
						chapUsfm: promise.verses[0].reference.usfm[0].split('.').slice(0, 2).join('.'),
						usfm: promise.usfm,
						text: promise.text,
						human: `${promise.verses[0].reference.human.split(':').slice(0,1)}:${action.verseRange}`,
						versionInfo: promise.versionInfo,
					}
					if (!title) title = `${promise.verses[0].reference.human.split(':').slice(0,1)}:${action.verseRange}`
					if (!next_verse) next_verse = promise.next_verse
					if (!previous_verse) previous_verse = promise.previous_verse
				}
			})

			return {
				current_verse: action.current_verse,
				primaryVersion: action.primaryVersion,
				versions: action.versions,
				verses: content,
				title: title,
				next_verse: next_verse,
				previous_verse: previous_verse,
			}


		default:
			return state
	}
}