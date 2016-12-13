import type from '../actions/constants'
import Immutable from 'immutable'

export default function reducer(state = [], action) {
	switch (action.type) {
		case type("momentsVerseColorsRequest"):
			return []

		case type("momentsVerseColorsSuccess"):
			return Immutable.fromJS(action.response.verse_colors).toJS()

		case type("momentsCreateSuccess"):
			const { extras: { color, references } } = action.response
			let verseColors = []
			references.forEach((ref) => {
				if (typeof color === 'string' && Array.isArray(ref.usfm) && ref.usfm.length > 0) {
					ref.usfm.forEach((usfm) => {
						verseColors.push([ usfm, color ])
					})
				}
			})
			return Immutable.fromJS(state).concat(verseColors).toJS()

		default:
			return state
	}
}