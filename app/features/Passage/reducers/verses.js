import type from '../actions/constants'
import Immutable from 'immutable'
import { getSelectionString } from '../../../lib/usfmUtils'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('bibleVersesRequest'):
			return { loading: true }

		case type('bibleVersesFailure'):
			return Immutable.fromJS(action).set('loading', false).toJS()

		case type('bibleVersesSuccess'):
			let content = {}
			Immutable.fromJS(action.response.verses).toJS().forEach((verse) => {
				content[`${action.params.id}-${verse.reference.usfm}`] = {
					heading: ``,
					content: verse.content,
					chapUsfm: verse.reference.usfm[0].split('.').slice(0, 2).join('.'),
					usfm: `${verse.reference.usfm[0].split('.').slice(0, 2).join('.')}.${getSelectionString(verse.reference.usfm)}`,
					text: action.params.text,
					human: verse.reference.human,
					versionInfo: action.params.versionInfo,
				}
			})
			return Immutable.fromJS(state).mergeDeep({
				verses: content,
				title: action.response.verses[0].reference.human,
				next_verse: action.response.next_verse,
				previous_verse: action.response.previous_verse,
			}).delete('loading').toJS()


		default:
			return state
	}
}