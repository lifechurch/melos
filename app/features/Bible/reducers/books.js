import type from '../actions/constants'
import Immutable from 'immutable'
import arrayToObject from '../../../lib/arrayToObject'

export default function reducer(state = {}, action) {
	switch (action.type) {

		case type("bibleVersionRequest"):
			return Immutable.fromJS(state).set('loading', true).toJS()

		case type('bibleVersionFailure'):
			return Immutable.fromJS(state).set('loading', false).toJS()

		case type("bibleVersionSuccess"):
			if (typeof action.response.books !== 'undefined') {
				// ordered array of books from api
				const all = Immutable.fromJS(action.response.books).toJS()

				// map of book usfm to its index in the books array
				const map = all.reduce((newBooks, book, idx) => {
					// map chapter number to its index
					// this is for book versions that have intros or non-contiguous chaps
					book.chapterMap = book.chapters.reduce((chapMap, chap, index) => {
						return Object.assign(chapMap, { [chap.human]: index })
					}, {})
					// replace chapter array with keyed chapter object
					book.chapters = arrayToObject(book.chapters, 'usfm')
					return Object.assign(newBooks, { [book.usfm]: idx })
				}, {})

				return { all, map }
			} else {
				return Immutable.fromJS(state).set('loading', false).toJS()
			}

		default:
			return state
	}
}