import getBibleVersionFromStorage from '@youversion/utils/lib/bible/getBibleVersionFromStorage'
import isVerseOrChapter from '@youversion/utils/lib/bible/isVerseOrChapter'
import bibleAction from '../endpoints/bible/action'

function bibleReference(ref, version = null) {
	return (dispatch) => {
		const { isVerse } = isVerseOrChapter(ref.split('+')[0])
		if (isVerse) {
			dispatch(bibleAction({
				method: 'verses',
				params: {
					id: version || getBibleVersionFromStorage(),
					references: [ref]
				},
			}))
		} else {
			dispatch(bibleAction({
				method: 'chapter',
				params: {
					id: version || getBibleVersionFromStorage(),
					reference: ref
				},
			}))
		}
	}
}

export default bibleReference
