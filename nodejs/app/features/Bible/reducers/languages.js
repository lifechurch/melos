import Immutable from 'immutable'
import type from '../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('bibleConfigurationRequest'):
			return {
				loading: true,
				all: {},
				byFilter: {
					filter: '',
					results: {}
				}
			}

		case type('bibleConfigurationFailure'):
			return Immutable.fromJS(state).set('loading', false).toJS()

		case type('bibleConfigurationSuccess'):
			if (typeof action.response.default_versions !== 'undefined') {

				// ordered array of languages from api
				const all = Immutable.fromJS(action.response.default_versions).toJS()

				// map of language_tag to its index in the languages array
				const map = all.reduce((map, lang, idx) => {
					return Object.assign(map, { [lang.language_tag]: idx })
				}, {})

				return { all, map }

			} else {
				return Immutable.fromJS(state).set('loading', false).toJS()
			}

		default:
			return state
	}
}
