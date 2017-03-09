
export function normalizeSelection(selection) {
	let originalObject
	let originalMap = {}

	// Convert object to array if necessary
	if (!Array.isArray(selection) && typeof selection === 'object') {
		originalObject = Object.assign({}, selection)
		selection = Object.keys(selection)
	}

	// Strip off book and chapter from USFM
	//  So JHN.1.5 becomes 5
	selection = selection.map((usfm) => {
		try {
			const val = parseInt(usfm.split('.')[2])
			if (typeof originalObject !== 'undefined') {
				originalMap[val] = usfm
			}
			return val
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

	return { originalObject, selection, originalMap }
}

function parseVerseNumbers(s, isFirst, isLast, isConsecutive, current, previous) {
	const inMidStreak = (s.slice(-1) === "-")
	if (isFirst) {
		s += `${current.toString()}`
	} else if (isConsecutive) {
		if (isLast) {
			if (inMidStreak) {
				s += `${current.toString()}`
			} else {
				s += `-${current.toString()}`
			}
		} else if (!inMidStreak) {
			s += "-"
		}
	} else {
		if (isLast) {
			if (inMidStreak) {
				s += `${previous.toString()}`
			}
			s += `,${current.toString()}`
		} else {
			if (inMidStreak) {
				s += `${previous.toString()}`
			}
			s += `,${current.toString()}`
		}
	}
	return s
}

function parseVerseText(s, isFirst, isLast, isConsecutive, current) {
	if (typeof current !== 'boolean') {
		if (isFirst) {
			s += `${current.toString()}`
		} else if (isConsecutive) {
			s += ` ${current.toString()}`
		} else {
			s += `\n\n${current.toString()}`
		}
	}
	return s
}


/**
 * Takes an Object or Array representing a list of selected verses
 *  and returns a human-readable string representing that selection
 *
 * @selection 	Object whose keys are USFMs to single verses i.e. JHN.1.1 or
 *							Array whose values are single verse USFMs
 */
export function getSelectionString(selectionObject, returnText = false) {
	let { selection, originalObject, originalMap } = normalizeSelection(selectionObject)

	// Reduce array of verse numbers to a human-readable string
	//  So [1,2,3,5,7,8,9] becomes 1-3,5,7-9
	let previousIsConsecutive
	let selectionString = selection.reduce((s, currentVerseNumber, currentIndex, a) => {
		let previousVerseNumber = (currentIndex > 0) ? a[currentIndex - 1] : currentVerseNumber

		const isFirst = (currentIndex === 0)
		const isLast = (currentIndex == (a.length - 1))
		let isConsecutive = (currentVerseNumber == (previousVerseNumber + 1))

		if (!returnText) {
			return parseVerseNumbers(s, isFirst, isLast, isConsecutive, currentVerseNumber, previousVerseNumber)
		} else {
			if (typeof originalObject[originalMap[previousVerseNumber]] === 'boolean') {
				isConsecutive = previousIsConsecutive
			}
			previousIsConsecutive = isConsecutive
			return parseVerseText(s, isFirst, isLast, isConsecutive, originalObject[originalMap[currentVerseNumber]])
		}
	}, "")

	return selectionString
}
