import Immutable from 'immutable'
import arrayToObject from '@youversion/utils/lib/arrayToObject'
import type from '../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {

		case type('bibleVersionRequest'): {
			const { isParallel } = action.extras
			if (!isParallel) {
				return {
					...state,
					loading: true
				}
			}
			return state
		}

		case type('bibleVersionFailure'): {
			const { isParallel } = action.extras
			if (!isParallel) {
				return {
					...state,
					loading: false
				}
			}
			return state
		}

		case 'BIBLE__VERSION__SUCCESS':
		case type('bibleVersionSuccess'): {
			const { isParallel } = action.extras
			if (!isParallel) {
				if (typeof action.response.books !== 'undefined') {
					// ordered array of books from api
					const all = action.response.books

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
					return {
						...state,
						loading: false
					}
				}
			}
			return state
		}

		default: {
			return state
		}
	}
}
