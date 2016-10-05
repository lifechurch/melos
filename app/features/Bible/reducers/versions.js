import type from '../actions/constants'
import Immutable from 'immutable'
import arrayToObject from '../../../lib/arrayToObject'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('bibleVersionsRequest'):
			return Immutable.fromJS(state).set('loading', true).toJS()

		case type('bibleVersionsFailure'):
			return Immutable.fromJS(state).set('loading', false).toJS()

		case type('bibleVersionsSuccess'):
			if (typeof action.response.versions !== 'undefined') {
				const versions = arrayToObject(action.response.versions, 'id')
				return Immutable.fromJS(state).mergeDeep({ selectedLanguage: action.params.language_tag, byLang: { [action.params.language_tag]: versions } }).set('loading', false).toJS()
			} else {
				return Immutable.fromJS(state).set('loading', false).toJS()
			}

		default:
			return state
	}
}