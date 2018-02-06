import Immutable from 'immutable'
import arrayToObject from '@youversion/utils/lib/arrayToObject'
import reducerGenerator from '../../generators/reducer'

export const getVerse = (state) => {
	return state.api
		&& state.api.bible
		&& state.api.bible.verse
		? state.api.bible.verse
		: null
}
export const getVerses = (state) => {
	return state.api
		&& state.api.bible
		&& state.api.bible.verses
		? state.api.bible.verses
		: null
}
export const getChapter = (state) => {
	return state.api
		&& state.api.bible
		&& state.api.bible.chapter
		? state.api.bible.chapter
		: null
}
export const getVersion = (state) => {
	return state.api
		&& state.api.bible
		&& state.api.bible.version
		? state.api.bible.version
		: null
}
export const getVersions = (state) => {
	return state.api
		&& state.api.bible
		&& state.api.bible.versions
		? state.api.bible.versions
		: null
}
export const getConfiguration = (state) => {
	return state.api
		&& state.api.bible
		&& state.api.bible.configuration
		? state.api.bible.configuration
		: {}
}


const methodDefinitions = {
	verse: {
		success: ({ state, params, response }) => {
			return Immutable
				.fromJS(state)
				.mergeDeepIn(['verse'], {
					[params.reference.toUpperCase()]: { [params.id]: { ...response, loading: false } }
				})
				.toJS()
		}
	},
	verses: {
		request: ({ state, params }) => {
			return Immutable
				.fromJS(state)
				.mergeDeepIn(['verses'], {
					[params.references]: { [params.id]: { loading: true } }
				})
				.toJS()
		},
		success: ({ state, params, response }) => {
			// let's pull out content and reference to top level to match chapter and
			// verse responses if there are only one verses
			const newResponse = 'verses' in response
				? Immutable
						.fromJS(response)
						.delete('verses')
						.merge(response.verses[0])
						.toJS()
				: response
			return Immutable
				.fromJS(state)
				.mergeDeepIn(['verses'], {
					[params.references]: { [params.id]: { ...newResponse, loading: false } }
				})
				.toJS()
		}
	},
	chapter: {
		key: ({ params }) => {
			return ['chapter', params.reference.toUpperCase(), params.id]
		},
		success: ({ state, params, response }) => {
			return Immutable
				.fromJS(state)
				.mergeDeepIn(['chapter'], {
					[params.reference.toUpperCase()]: { [params.id]: { ...response, loading: false, errors: false } }
				})
				.toJS()
		}
	},
	versions: {
		success: ({ state, params, response }) => {
			const byId = arrayToObject(response.versions, 'id')
			const all = response.versions.map(version => { return version.id })

			return Immutable
				.fromJS(state)
				.mergeDeepIn(['versions'], {
					byLang: {
						[params.language_tag]: {
							all,
							byId,
						}
					},
				})
				.toJS()
		}
	}
}

const bibleReducer = reducerGenerator('bible', methodDefinitions)

export default bibleReducer
