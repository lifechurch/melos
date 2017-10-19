import React from 'react'
import Immutable from 'immutable'
import cookie from 'react-cookie'
import ActionCreators from '../features/Bible/actions/creators'
import LocaleList from '../../locales/config/localeList.json'
import LocalStore from './localStore'
import LocaleVersions from '../../locales/config/localeVersions.json'


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
		}, { local_abbreviation }))
		.then((response) => {
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
	const audioTiming = {
		startTime: null,
		endTime: null
	}

	if (!Array.isArray(timing)) {
		return audioTiming
	}

	for (let i = 0; i < timing.length; i++) {
		const ref = timing[i]
		if (startRef.toString().toLowerCase() === ref.usfm.toString().toLowerCase()) {
			audioTiming.startTime = ref.start
		}
		if (endRef.toString().toLowerCase() === ref.usfm.toString().toLowerCase()) {
			audioTiming.endTime = ref.end
		}

		if (audioTiming.startTime && audioTiming.endTime) {
			return audioTiming
		}
	}

	return audioTiming
}


export function deepLinkPath(chapUsfm, versionID, versionAbbr, verseNum = null) {
	if (!chapUsfm) { return null }
	let android, ios, native

	if (verseNum && versionID) {
		ios = `bible?reference=${chapUsfm}.${verseNum}&version_id=${versionID}`
		android = `bible?reference=${chapUsfm}.${verseNum}&version=${versionID}`
		native = `bible?reference=${chapUsfm}.${verseNum}.${versionAbbr}&version=${versionID}`
	} else if (versionID) {
		ios = `bible?reference=${chapUsfm}&version_id=${versionID}`
		android = `bible?reference=${chapUsfm}&version=${versionID}`
		native = `bible?reference=${chapUsfm}.${versionAbbr}&version=${versionID}`
	} else {
		ios = `bible?reference=${chapUsfm}`
		android = `bible?reference=${chapUsfm}`
		native = `bible?reference=${chapUsfm}`
	}

	return { android, ios, native }
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

export function chapterifyUsfm(usfmArg) {
	if (!usfmArg) return null
	const usfm = Array.isArray(usfmArg)
		? usfmArg[0]
		: usfmArg
	const usfmParts = usfm.split('.')
	return usfmParts.slice(0, 2).join('.')
}

export function isVerseOrChapter(usfmArg) {
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

export function buildCopyright(formatMessage, version) {
	let content = ''
	const {
		reader_footer,
		reader_footer_url,
		local_abbreviation,
		publisher
	} = version

	if (reader_footer && (reader_footer.html || reader_footer.text)) {
		content += formatMessage({ id: 'Reader.version.courtesy of' }, { abbreviation: local_abbreviation, publisher: publisher.name })
		content += '<br />'
		content += reader_footer.html ? reader_footer.html : reader_footer.text
	} else {
		content += (version && version.copyright_short && version.copyright_short.html) ? version.copyright_short.html : version.copyright_short.text
	}

	/* eslint-disable react/no-danger */
	return {
		content: (<div dangerouslySetInnerHTML={{ __html: content }} />),
		link: (reader_footer_url) || `/versions/${version.id}`,
		openInNewTab: !!reader_footer_url
	}
	/* eslint-enable react/no-danger */
}

export function getBibleVersionFromStorage(language_tag = null) {
	let defaultVersion = 1
	if (language_tag && language_tag in LocaleVersions) {
		defaultVersion = LocaleVersions[language_tag].text[0]
	}
	return cookie.load('version') || cookie.load('alt_version') || defaultVersion
}


export function parseVerseFromContent({ usfms, fullContent }) {
	const textOutput = []
	const htmlOutput = []

	if (usfms && fullContent) {
		const doc = new DOMParser().parseFromString(fullContent, 'text/html')
		const usfmList = Array.isArray(usfms)
			? usfms
			: [usfms]

		usfmList.forEach((usfm) => {
			const htmlXpath = `//div/div/div/span[contains(concat('+',@data-usfm,'+'),'+${usfm}+')]`
			const textXpath = `${htmlXpath}/node()[not(contains(concat(\' \',@class,\' \'),\' note \'))][not(contains(concat(\' \',@class,\' \'),\' label \'))]`

			const html = doc.evaluate(htmlXpath, doc, null, XPathResult.ANY_TYPE, null)
			const text = doc.evaluate(textXpath, doc, null, XPathResult.ANY_TYPE, null)

			// text
			let nextText = text.iterateNext()
			while (nextText) {
				textOutput.push(nextText.textContent)
				nextText = text.iterateNext()
			}
			// html
			let nextHtml = html.iterateNext()
			while (nextHtml) {
				htmlOutput.push(nextHtml.outerHTML)
				nextHtml = html.iterateNext()
			}
		})
	}

	return {
		text: textOutput
			.join(' ')
			.replace('\n', ' ')
			.replace('  ', ' ')
			.replace(' ,', ','),
		html: htmlOutput.join('')
	}
}
