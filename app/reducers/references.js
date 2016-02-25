import contentType from '../features/EventEdit/features/content/actions/constants'

export default function references(state = {}, action) {
	switch(action.type) {

		case contentType('versionsSuccess'):
			var versions = action.response.versions
			var new_state = Object.assign({}, state)
			for (var i = versions.length - 1; i >= 0; i--) {
				new_state.versions[versions[i].id] = versions[i]
			}
			return new_state

		case contentType('versionSuccess'):
			const version_id = action.response.id
			var newBooks = Object.assign({}, state.books)

			newBooks[version_id] = []

			for (var i = 0; i < action.response.books.length; i++) {
				newBooks[version_id].push({
					usfm: action.response.books[i].usfm,
					name: action.response.books[i].human,
					chapters: action.response.books[i].chapters.length
				})
			}

			return Object.assign({}, state, {books: newBooks})

		default:
			return state
	}
}
