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

			if (color && references && references.length > 0) {
				references.forEach((ref) => {
					if (typeof color === 'string' && Array.isArray(ref.usfm) && ref.usfm.length > 0) {
						if (ref && ref.usfm && ref.usfm.length > 0) {
							ref.usfm.forEach((usfm) => {
								verseColors.push([ usfm, color ])
							})
						}
					}
				})
				return Immutable.fromJS(state).concat(verseColors).toJS()
			} else {
				return state
			}

		default:
			return state
	}
}