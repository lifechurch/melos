import Immutable from 'immutable'
import type from '../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('bibleVersesRequest'):
			return { loading: true }

		case type('bibleVersesFailure'):
			return Immutable.fromJS(action).set('loading', false).toJS()

		case type('bibleVersesSuccess'): {
			const content = {}
			const references = []
			if (typeof action.response.verses === 'undefined') {
				return state
			}
			let local_abbreviation = ''
			if (action.extras && action.extras.local_abbreviation) {
				local_abbreviation = action.extras.local_abbreviation.toUpperCase()
			}
			Immutable.fromJS(action.response.verses).toJS().forEach((verse) => {
				content[`${action.params.id}-${verse.reference.usfm}`] = {
					heading: `${verse.reference.human} ${local_abbreviation}`,
					content: verse.content,
					usfm: verse.reference.usfm,
					human: verse.reference.human,
					versionInfo: {
						id: action.params.id,
						local_abbreviation,
					},
				}
				references.push({ usfm: verse.reference.usfm, version_id: action.params.id })
			})
			// return Immutable.fromJS(state).merge({ verses: content, references }).delete('loading').toJS()
			return { verses: content, references }
		}

		default:
			return state
	}
}
