
export function normalizeSelection(selection) {
	let originalObject
	const originalMap = {}
	let normalized = []
	// Convert object to array if necessary
	if (!Array.isArray(selection) && typeof selection === 'object') {
		originalObject = Object.assign({}, selection)
		normalized = Object.keys(selection)
	}

	// Strip off book and chapter from USFM
	//  So JHN.1.5 becomes 5
	normalized = selection.map((usfm) => {
		try {
			const val = parseInt(usfm.split('.')[2], 10)
			if (typeof originalObject !== 'undefined') {
				originalMap[val] = usfm
			}
			return val
		} catch (e) {
			return null
		}
	})

	// Sort verses in numerical order
	normalized.sort((a, b) => {
		try {
			const A = parseInt(a, 10)
			const B = parseInt(b, 10)

			if (A < B) {
				return -1
			} else if (A > B) {
				return 1
			} else {
				return 0
			}
		} catch (e) {
			return 0
		}
	})

	return { originalObject, selection: normalized, originalMap }
}

function parseVerseNumbers(s, isFirst, isLast, isConsecutive, current, previous) {
	let string = s
	const inMidStreak = (s.slice(-1) === '-')
	if (isFirst) {
		string += `${current.toString()}`
	} else if (isConsecutive) {
		if (isLast) {
			if (inMidStreak) {
				string += `${current.toString()}`
			} else {
				string += `-${current.toString()}`
			}
		} else if (!inMidStreak) {
			string += '-'
		}
	} else if (isLast) {
		if (inMidStreak) {
			string += `${previous.toString()}`
		}
		string += `,${current.toString()}`
	} else {
		if (inMidStreak) {
			string += `${previous.toString()}`
		}
		string += `,${current.toString()}`
	}
	return string
}

function parseVerseText(s, isFirst, isLast, isConsecutive, current) {
	let string = s
	if (typeof current !== 'boolean') {
		if (isFirst) {
			string += `${current.toString()}`
		} else if (isConsecutive) {
			string += ` ${current.toString()}`
		} else {
			string += `\n\n${current.toString()}`
		}
	}
	return string
}


/**
 * Takes an Object or Array representing a list of selected verses
 *  and returns a human-readable string representing that selection
 *
 * @selection 	Object whose keys are USFMs to single verses i.e. JHN.1.1 or
 *							Array whose values are single verse USFMs
 */
export default function getSelectionString(selectionObject, returnText = false) {
	const { selection, originalObject, originalMap } = normalizeSelection(selectionObject)

	// Reduce array of verse numbers to a human-readable string
	//  So [1,2,3,5,7,8,9] becomes 1-3,5,7-9
	let previousIsConsecutive
	const selectionString = selection.reduce((s, currentVerseNumber, currentIndex, a) => {
		const previousVerseNumber = (currentIndex > 0) ? a[currentIndex - 1] : currentVerseNumber

		const isFirst = (currentIndex === 0)
		const isLast = (currentIndex === (a.length - 1))
		let isConsecutive = (currentVerseNumber === (previousVerseNumber + 1))

		if (!returnText) {
			return parseVerseNumbers(s, isFirst, isLast, isConsecutive, currentVerseNumber, previousVerseNumber)
		} else {
			if (typeof originalObject[originalMap[previousVerseNumber]] === 'boolean') {
				isConsecutive = previousIsConsecutive
			}
			previousIsConsecutive = isConsecutive
			return parseVerseText(s, isFirst, isLast, isConsecutive, originalObject[originalMap[currentVerseNumber]])
		}
	}, '')

	return selectionString
}
