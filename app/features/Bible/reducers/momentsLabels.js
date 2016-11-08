import type from '../actions/constants'
import Immutable from 'immutable'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('momentsLabelsRequest'):
			return { loading: true }

		case type('momentsLabelsFailure'):
			return { loading: false, errors: true }

		case type('momentsLabelsSuccess'):
			const byCount = Immutable.fromJS(action.response.data).toJS()
			const byAlphabetical = Immutable.fromJS(action.response.data).toJS().sort((a, b) => {
				// sort takes a function to compare elements
				// return -1 if value should be before second element
				// return 1 if value should be after
				// return 0 if values are equal
				// localeCompare does lowercase and unicode compare
				// we can also pass in language_tag for locale
				let val = a.label.localeCompare(b.label)

				return val
			})
			// if the first sorted label is not an alphabetical character set up the swagtag header
			if (!byAlphabetical[0].label.charAt(0).match(/^[a-zA-Z]/)) {
				byAlphabetical[0].groupHeading = '#'
			} else {
				byAlphabetical[0].groupHeading = byAlphabetical[0].label.charAt(0).toUpperCase()
			}
			byAlphabetical.sort((a, b) => {
				// build headers for alphabetic groupings
				// compare the first character of each label
				// if the label starts with a letter set up the header once per letter appearance
				if (a.label.charAt(0).match(/^[a-zA-Z]/) && (a.label.charAt(0).localeCompare(b.label.charAt(0))) != 0) {
					a.groupHeading = a.label.charAt(0).toUpperCase()
				} else {
					a.groupHeading = null
				}
			})

			return Immutable.fromJS({ byCount, byAlphabetical }).toJS()

		default:
			return state
	}
}