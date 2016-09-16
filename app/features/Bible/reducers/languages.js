import type from '../actions/constants'
import Immutable from 'immutable'
import arrayToObject from '../../../lib/arrayToObject'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type("bibleConfigurationRequest"):
			return {
				loading: true,
				all: {},
				byFilter: {
					filter: "",
					results: {}
				}
			}

		case type("bibleConfigurationFailure"):
			return Immutable.fromJS(state).set('loading', false).toJS()

		case type("bibleConfigurationSuccess"):
			if (typeof action.response.default_versions !== 'undefined') {
				const languages = arrayToObject(action.response.default_versions, 'language_tag')
				return Immutable.fromJS(state).mergeDeep({ all: languages, loading: false }).toJS()
			} else {
				return Immutable.fromJS(state).set('loading', false).toJS()
			}

		default:
			return state
	}
}