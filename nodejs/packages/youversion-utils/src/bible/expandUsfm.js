/**
 * convert a minified usfm to an array of usfms with plus delimiting on ranges
 * i.e. rev.20.1,4-6 -> [rev.20.1, rev.20.4+rev.20.5+rev.20.6]
 * @param  {String} usfm 	[usfm]
 * @param  {String} delimiter 	[character to join a range with, if not passed
 * then we'll just create a full usfm for each verse in the range]
 * @return {Array}      	[expanded usfms]
 */
export default function (usfm, delimiter = '+') {
	if (typeof usfm === 'undefined' || (Array.isArray(usfm) && typeof usfm[0] === 'undefined')) return []
	const refArray = Array.isArray(usfm)
    ? usfm[0].split('.')
    : usfm.split('.')
	const chapUsfm = refArray.slice(0, 2).join('.')
	const verseORVerseRange = refArray.pop()
	// break up the verses into single verse, or verse range
	const versesArray = []
	verseORVerseRange.split(',').forEach((verseNum) => {
		// if it's a range, build the string for the API
		if (verseNum.includes('-')) {
			const consecutiveString = []
			const firstVerseOfRange = parseInt(verseNum.split('-')[0], 10)
			const lastVerseOfRange = parseInt(verseNum.split('-')[1], 10)

			for (let i = firstVerseOfRange; i <= lastVerseOfRange; i++) {
				const verse = `${chapUsfm}.${i}`
				if (delimiter) {
					consecutiveString.push(verse)
				} else {
					versesArray.push(verse)
				}
			}

			if (delimiter) {
				versesArray.push(consecutiveString.join(delimiter))
			}
		} else {
			versesArray.push(`${chapUsfm}.${verseNum}`)
		}
	})

	return versesArray
}
