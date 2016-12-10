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
				content[`${action.params.id}-${verse.reference.usfm}`] = {
					heading: ``,
					content: verse.content,
					usfm: verse.reference.usfm[0],
					text: action.params.text,
					human: verse.reference.human,
					versionInfo: action.params.versionInfo,
				}
			})
			return Immutable.fromJS(state).mergeDeep({
				verses: content,
				title: action.response.verses[0].reference.human,

			}).delete('loading').toJS()


		default:
			return state
	}
}