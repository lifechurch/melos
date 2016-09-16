import type from '../actions/constants'
import Immutable from 'immutable'

export default function reducer(state = {}, action) {
	switch (action.type) {

		case type("bibleVersionRequest"):
			return {
				loading: true,
				all: {},
				byFilter: {
					filter: "",
					results: {}
				},
				byCanon: {}
			}

		case type('bibleVersionFailure'):
			return Immutable.fromJS(state).set('loading', false).toJS()

		case type("bibleVersionSuccess"):
			if (typeof action.response.books !== 'undefined') {
				const all = Immutable.fromJS(action.response.books)

				let byCanon = {}
				action.response.books.forEach((book) => {
					if (typeof book.canon !== 'undefined') {
						if (typeof byCanon[book.canon] == 'undefined') { byCanon[book.canon] = {} }
						byCanon[book.canon][book.usfm] = book
					} else {
						byCanon['other'][book.usfm] = book
					}
				})

				return Immutable.fromJS({}).set('all', all).set('byCanon', byCanon).set('loading', false).toJS()

			} else {
				return Immutable.fromJS(state).set('loading', false).toJS()
			}

		default:
			return state
	}
}