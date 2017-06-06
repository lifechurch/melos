import Immutable from 'immutable'
import type from '../actions/constants'

export default function reducer(state = [], action) {
	switch (action.type) {
		case type('momentsVerseColorsRequest'):
			return []

		case type('momentsVerseColorsSuccess'): {
			const { response: { verse_colors } } = action
			if (verse_colors) {
				return Immutable.fromJS(action.response.verse_colors).toJS()
			} else {
				return state
			}
		}

		case type('momentsCreateSuccess'): {
			const { extras: { color, references } } = action.response
			const verseColors = []

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
		}

		default: {
			return state
		}
	}
}
