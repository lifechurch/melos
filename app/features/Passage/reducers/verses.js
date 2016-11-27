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
			Immutable.fromJS(action.response.verses).toJS().forEach((verse) => {
				content[`${action.params.id}-${verse.reference.usfm}`] = { content: verse.content, heading: ` ${verse.reference.human}`, version: action.params.id }
			})

			return Immutable.fromJS(state).merge(content).delete('loading').toJS()

		default:
			return state
	}
}