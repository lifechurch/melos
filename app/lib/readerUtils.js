import Immutable from 'immutable'
import ActionCreators from '../features/Bible/actions/creators'
import LocalStore from './localStore'

// default settings to build user settings below
const DEFAULT_READER_SETTINGS = {
	fontFamily: 'Arial',
	fontSize: 18,
	showFootnotes: true,
	showVerseNumbers: true
}

export const USER_READER_SETTINGS = {
	fontFamily: LocalStore.getIn('reader.settings.fontFamily') || DEFAULT_READER_SETTINGS.fontFamily,
	fontSize: LocalStore.getIn('reader.settings.fontSize') || DEFAULT_READER_SETTINGS.fontSize,
	showFootnotes:	typeof LocalStore.getIn('reader.settings.showFootnotes') === 'boolean' ?
									LocalStore.getIn('reader.settings.showFootnotes') : true,
	showVerseNumbers:	typeof LocalStore.getIn('reader.settings.showVerseNumbers') === 'boolean' ?
										LocalStore.getIn('reader.settings.showVerseNumbers') : true
}

export function handleVerseSelect(
	refToThis,
	verseSelection,
	refUrl,
	id,
	local_abbreviation,
	human,
	verseColors,
	dispatch
) {

	// get the verses that are both selected and already have a highlight
	// color associated with them, so we can allow the user to delete them
	const deletableColors = []
	verseSelection.verses.forEach((selectedVerse) => {
		verseColors.forEach((colorVerse) => {
			if (selectedVerse === colorVerse[0]) {
				deletableColors.push(colorVerse[1])
			}
		})
	})
	refToThis.setState({
		deletableColors,
		verseSelection: Immutable.fromJS(verseSelection).merge({
			chapter: human,
			url: refUrl,
			version: id
		}).toJS()
	})
	// now merge in the text for the verses for actions like copy and share
	// we're setting state with all the other verseAction before so this api call doesn't slow anything down
	if (verseSelection.verses && verseSelection.verses.length > 0) {
		dispatch(ActionCreators.bibleVerses({
			id,
			references: verseSelection.verses,
			format: 'text',
			local_abbreviation
		})).then((response) => {
			refToThis.setState({
				verseSelection: Immutable.fromJS(refToThis.state.verseSelection).merge({
					text: response.verses.reduce((acc, curr, index) => {
						// don't put a space in front of the first string
						if (index !== 0) {
							return `${acc} ${curr.content}`
						} else {
							return acc + curr.content
						}
					}, '')
				}).toJS()
			})
		})
	}
}

export function handleVerseSelectionClear(refToThis, refToChapter) {
	if (typeof refToChapter !== 'undefined' && refToChapter) {
		refToChapter.clearSelection()
	}
	refToThis.setState({ verseSelection: {}, deletableColors: [] })
}
