import contentType from '../features/EventEdit/features/content/actions/constants'

export default function references(state = {}, action) {
	switch (action.type) {

		case contentType('versionsSuccess'):
			var versions = action.response.versions
			var new_state = Object.assign({}, state, {
				order: {
					...state.order,
					[action.params.language_tag]: versions.map((v) => { return v.id })
				}
			})

			if (typeof new_state.versions[action.params.language_tag] === 'undefined') {
				new_state.versions[action.params.language_tag] = {}
			}
			for (var i = versions.length - 1; i >= 0; i--) {
				new_state.versions[action.params.language_tag][versions[i].id] = versions[i]
			}
			return new_state

		case contentType('versionRequest'):
			var version_id = action.params.id
			var newBooks = Object.assign({}, state.books)
			newBooks[version_id] = []
			return Object.assign({}, state, {
				books: newBooks
			})

		case contentType('versionSuccess'):
			var version_id = action.response.id
			var newBooks = Object.assign({}, state.books)

			newBooks[version_id] = []

			for (var i = 0; i < action.response.books.length; i++) {
				newBooks[version_id].push({
					usfm: action.response.books[i].usfm,
					name: action.response.books[i].human,
					chapters: action.response.books[i].chapters.length
				})
			}

			return Object.assign({}, state, {
				books: newBooks,
				langs: {
					...state.langs,
					[action.params.id]: action.response.language.language_tag
				}
			})

		default:
			return state
	}
}
