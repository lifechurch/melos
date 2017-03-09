import type from '../actions/constants'
import Immutable from 'immutable'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('bibleVersesRequest'):
			return { loading: true }

		case type('bibleVersesFailure'):
			return Immutable.fromJS(action).set('loading', false).toJS()

		case type('bibleVersesSuccess'):
			let content = {}
			let references = []
			if (typeof action.response.verses === 'undefined') {
				return state
			}
			Immutable.fromJS(action.response.verses).toJS().forEach((verse) => {
				content[`${action.params.id}-${verse.reference.usfm}`] = {
					heading: `${verse.reference.human} ${action.params.local_abbreviation ? action.params.local_abbreviation.toUpperCase() : ''}`,
					content: verse.content,
					usfm: verse.reference.usfm,
					human: verse.reference.human,
					versionInfo: {
						id: action.params.id,
						local_abbreviation: action.params.local_abbreviation ? action.params.local_abbreviation.toUpperCase() : '',
					},
				}
				references.push({ usfm: verse.reference.usfm, version_id: action.params.id })
			})
			// return Immutable.fromJS(state).merge({ verses: content, references }).delete('loading').toJS()
			return { verses: content, references }

		default:
			return state
	}
}