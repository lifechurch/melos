
/**
 * Takes an Object or Array representing a list of selected verses
 *  and returns a human-readable string representing that selection
 *
 * @selection 	Object whose keys are USFMs to single verses i.e. JHN.1.1 or
 *							Array whose values are single verse USFMs
 */
export function getSelectionString(selection) {
	// Convert object to array if necessary
	if (!Array.isArray(selection) && typeof selection === 'object') {
		selection = Object.keys(selection)
	}

	// Strip off book and chapter from USFM
	//  So JHN.1.5 becomes 5
	selection = selection.map((usfm) => {
		try {
			return parseInt(usfm.split('.')[2])
		} catch(e) {
			return null
		}
	})

	// Sort verses in numerical order
	selection.sort((a, b) => {
		try {
			var a = parseInt(a)
			var b = parseInt(b)

			if (a < b) {
				return -1
			} else if (a > b) {
				return 1
			} else {
				return 0
			}
		} catch(e) {
			return 0
		}
	})

	// Reduce array of verse numbers to a human-readable string
	//  So [1,2,3,5,7,8,9] becomes 1-3,5,7-9
	let selectionString = selection.reduce((s, currentVerseNumber, currentIndex, a) => {
		let previousVerseNumber = (currentIndex > 0) ? a[currentIndex - 1] : currentVerseNumber

		const isFirstElement = (currentIndex === 0)
		const isConsecutiveNumbers = (currentVerseNumber == (previousVerseNumber + 1))
		const isLastElement = (currentIndex == (a.length - 1))
		const hasTrailingDash = (s.slice(-1) === '-')

		if (isFirstElement) {
			s += `${currentVerseNumber.toString()}`
		} else if (isConsecutiveNumbers) {
			if (isLastElement) {
				if (hasTrailingDash) {
					s += `${currentVerseNumber.toString()}`
				} else {
					s += `-${currentVerseNumber.toString()}`
				}
			} else if (!hasTrailingDash) {
				s += '-'
			}
		} else {
			if (isLastElement) {
				if (hasTrailingDash) {
					s += `${previousVerseNumber.toString()}`
				}
				s += `,${currentVerseNumber.toString()}`
			} else {
				if (hasTrailingDash) {
					s += `${previousVerseNumber.toString()}`
				}
				s += `,${currentVerseNumber.toString()}`
			}
		}
		return s
	}, "")

	return selectionString
}
