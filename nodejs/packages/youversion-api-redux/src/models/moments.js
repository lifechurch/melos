import { createSelector } from 'reselect'
import Immutable from 'immutable'
import moment from 'moment'
import { getVerseColors, getColors, getLabels, getVotd, getConfiguration } from '../endpoints/moments/reducer'

const getMomentsModel = createSelector(
	// get each piece of state needed to build out the full model
	[ getVerseColors, getColors, getLabels, getVotd, getConfiguration ],
	(verseColors, colors, labels, votd, configuration) => {
		const momentsModel = {}

		// CONFIGURATION ---------------------------------------
		if (configuration) {
			momentsModel.configuration = configuration
		}

		// VERSE COLORS ----------------------------------------
		if (verseColors) {
			momentsModel.verseColors = verseColors
		}

		// COLORS ----------------------------------------------
		if (colors) {
			momentsModel.colors = colors
		}

		// LABELS ----------------------------------------------
		if (labels) {
			const byCount = labels
			const byAlphabetical = labels.sort((a, b) => {
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
					const a = byAlphabetical[index - 1]
					const b = byAlphabetical[index]

					if (b.label.charAt(0).match(/^[a-zA-Z]/) && (a.label.charAt(0).toLowerCase().localeCompare(b.label.charAt(0).toLowerCase(), { sensitivity: 'base' })) !== 0) {
						b.groupHeading = b.label.charAt(0).toUpperCase()
					} else {
						b.groupHeading = null
					}
				}
			}
			momentsModel.labels = { byCount, byAlphabetical }
		}

		// VOTD ------------------------------------------------
		if (votd) {
			momentsModel.votd = votd
		}

		// utility functions on model
		momentsModel.pullVotd = (dayOfYear = moment().dayOfYear()) => {
			const dayIndex = parseInt(dayOfYear, 10) - 1
			if (
				momentsModel.votd
				&& momentsModel.votd.length > 0
				&& dayIndex in momentsModel.votd
			) {
				return momentsModel.votd[dayIndex]
			}
			return null
		}


		return momentsModel
	}
)

export default getMomentsModel
