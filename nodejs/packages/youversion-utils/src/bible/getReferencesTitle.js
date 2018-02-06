import getSelectionString from './getSelectionString'

/**
 * takes an array of usfms and the list of books from the version call and
 * returns a human readable string of the reference(s)
 * MAT.2.3, MAT.2.4 -> Matthew 2:3-4
 * NOTE: this expects each reference to be from the same book and chapter
 * (it doesn't really make sense to ask for the human readable string of mat.3 and jhn.4)
 *
 * @param  {[array]} bookList [description]
 * @param  {[array]} usfmList [description]
 * @return {[string]}          [description]
 */
export default function getReferencesTitle({ bookList, usfmList, isRtl = false }) {
	const strings = {
		usfm: '',
		book: '',
		title: '',
	}
	const usfmArray = Array.isArray(usfmList)
		? usfmList
		: [usfmList]
	if (
		!bookList
		|| !usfmList
		|| bookList.length < 1
		|| usfmArray.length < 1
	) {
		return strings
	}

	const bookUsfm = usfmArray[0].split('.')[0]
	const chapNum = usfmArray[0].split('.')[1]
	const bookObj = bookList.filter((book) => {
		return book.usfm.toLowerCase() === bookUsfm.toLowerCase()
	})[0]
	if (!(bookObj && bookObj.human)) return strings
	const bookName = bookObj.human

	// let's build the verse string
	let usfms = []
	usfmArray.forEach((usfmString) => {
		usfms = usfms.concat(usfmString.split('+'))
	})
	const verseString = usfms.length > 1
		? getSelectionString(usfms)
		: usfmArray[0].split('.')[2]

	strings.usfm = `${bookUsfm}.${chapNum}${verseString ? `.${verseString}` : ''}`
	strings.book = bookName
	strings.title = `${bookName} ${chapNum}${verseString ? `:${verseString}` : ''}`
	return strings
}
