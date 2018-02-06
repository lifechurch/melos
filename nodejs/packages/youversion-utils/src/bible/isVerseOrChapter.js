export default function isVerseOrChapter(usfmArg) {
	const IS_BOOK = /^\d?[a-zA-Z]{2,3}$/
	const IS_CHAPTER = /^(INTRO)?[0-9_]+$/
	const IS_VERSE = /^[0-9-,_]+$/
	const FALLBACK_VALUE = { isVerse: false, isChapter: false }
	const usfm = Array.isArray(usfmArg)
		? usfmArg[0]
		: usfmArg
	if (typeof usfm !== 'string' || usfm.length === 0) {
		return FALLBACK_VALUE
	}

	const usfmParts = usfm.split('+')[0].split('.')

	let isVerse = usfmParts.length >= 4
	let isChapter = usfmParts.length === 2

	if (
		usfm.length === 0 ||
		!IS_BOOK.test(usfmParts[0]) ||
		!IS_CHAPTER.test(usfmParts[1])
	) {
		return FALLBACK_VALUE
	} else if (usfmParts.length >= 3) {
		isVerse = IS_VERSE.test(usfmParts[2])
		isChapter = !isVerse
	}

	return { isVerse, isChapter }
}
