import Immutable from 'immutable'
import arrayToObject from '@youversion/utils/lib/arrayToObject'
import type from '../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('bibleVersionsRequest'):
			return Immutable.fromJS(state).set('loading', true).toJS()

		case type('bibleVersionsFailure'):
			return Immutable.fromJS(state).set('loading', false).toJS()

		case 'BIBLE__VERSIONS__SUCCESS':
		case type('bibleVersionsSuccess'):
			if (typeof action.response.versions !== 'undefined') {
				const versions = arrayToObject(action.response.versions, 'id')
				const map = action.response.versions.map(version => { return version.id })

				return Immutable.fromJS(state).mergeDeep({
					selectedLanguage: action.params.language_tag,
					byLang: {
						[action.params.language_tag]: { versions, map }
					}
				}).set('loading', false).toJS()
			} else {
				return Immutable.fromJS(state).set('loading', false).toJS()
			}

		default:
			return state
	}
}
