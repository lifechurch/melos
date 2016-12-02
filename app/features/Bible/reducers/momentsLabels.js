import type from '../actions/constants'
import Immutable from 'immutable'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('momentsLabelsRequest'):
			return { loading: true }

		case type('momentsLabelsFailure'):
			return Immutable.fromJS(action).set('loading', false).toJS()

		case type('momentsLabelsSuccess'):
			const byCount = Immutable.fromJS(action.response.labels).toJS()
			const byAlphabetical = Immutable.fromJS(action.response.labels).toJS().sort((a, b) => {
				// sort takes a function to compare elements
				// return -1 if value should be before second element
				// return 1 if value should be after
				// return 0 if values are equal
				// localeCompare does lowercase and unicode compare
				// we can also pass in language_tag for locale
				return a.label.toLowerCase().localeCompare(b.label.toLowerCase(), { sensitivity: 'base' })
			})

			// if the first sorted label is not an alphabetical character set up the swagtag header
			// we need to do this so we don't keep setting the # multiple times for different labels
			// in the following loop
			if (!byAlphabetical[0].label.charAt(0).match(/^[a-zA-Z]/)) {
				byAlphabetical[0].groupHeading = '#'
			} else {
				byAlphabetical[0].groupHeading = byAlphabetical[0].label.charAt(0).toUpperCase()
			}

			// build headers for alphabetic groupings
			// compare the first character of each label
			// if the label starts with a letter set up the header once per letter appearance
			for (let index = 2; index < byAlphabetical.length; index++) {
				if (index < byAlphabetical.length) {
					let a = byAlphabetical[index - 1]
					let b = byAlphabetical[index]

					if (a.label.charAt(0).match(/^[a-zA-Z]/) && (a.label.charAt(0).toLowerCase().localeCompare(b.label.charAt(0).toLowerCase(), { sensitivity: 'base' })) !== 0) {
						b.groupHeading = b.label.charAt(0).toUpperCase()
					} else {
						b.groupHeading = null
					}
				}
			}

			return Immutable.fromJS({ byCount, byAlphabetical }).toJS()

		default:
			return state
	}
}