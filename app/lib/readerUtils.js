import Immutable from 'immutable'
import ActionCreators from '../features/Bible/actions/creators'
import LocaleList from '../../locales/config/localeList.json'
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
			chapter: human.split(':')[0],
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

export function getVerseAudioTiming(startRef, endRef, timing) {
	let startTime = null
	let endTime = null

	if (!Array.isArray(timing)) {
		console.log('invalid param: timing must be an array')
		return null
	}

	for (let i = 0; i < timing.length; i++) {
		const ref = timing[i]
		if (startRef.toString() === ref.usfm.toString()) {
			startTime = ref.start
		}
		if (endRef.toString() === ref.usfm.toString()) {
			endTime = ref.end
		}

		if (startTime && endTime) {
			return { startTime, endTime }
		}
	}

	return { startTime, endTime }
}

// From Rails - Refactored
function getBibleLink(reference, locale) {
	const {
		usfm,
		version_string, // string
		version, // number
	} = reference

	const refPath = `${version}/${usfm}.${version_string}`

	return locale === 'en' ? `/bible/${refPath}`.toLowerCase() : `/bible/${locale}/${refPath}`.toLowerCase()
}

// From Rails - Refactored
export function buildMeta(props) {
	const { version, usfm, hosts } = props

	let canonicalHref
	let showCanonical

	const link = []
	const meta = []

	const reference = {
		usfm,
		version_string: version.local_abbreviation,
		version: version.id,
	}

	if (version && version.id && usfm) {
		showCanonical = true
	}

	let fullPath = null
	let href = null

	LocaleList.forEach((locale) => {
		if (version.language.iso_639_1 === locale.locale2) {
			fullPath = getBibleLink(reference, locale.locale2)
			href = `${hosts.railsHost}${fullPath}`
		}
	})

	if (showCanonical) {
		// didn't match a localized locale, set to english
		if (!href) {
			canonicalHref = `${hosts.railsHost}${getBibleLink(reference, 'en')}`
		} else {
			canonicalHref = href
		}
	}

	if (canonicalHref !== null && typeof canonicalHref !== 'undefined') {
		link.push({ rel: 'canonical', href: canonicalHref })
		meta.push({ property: 'og:url', content: canonicalHref })
		meta.push({ property: 'twitter:url', content: canonicalHref })
	}

	return { link, meta }
}
