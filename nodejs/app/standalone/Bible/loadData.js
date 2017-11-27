import cookie from 'react-cookie';
import Immutable from 'immutable';
import isVerseOrChapter from '@youversion/utils/lib/bible/isVerseOrChapter'
import localeVersions from '@youversion/stringer-things/dist/config/localeVersions.json'
import BibleActionCreator from '../../features/Bible/actions/creators'
import PassageActionCreator from '../../features/Passage/actions/creators'

/**
 * Loads a data.
 *
 * @param      {object}   params         The parameters
 * @param      {object}   startingState  The starting state
 * @param      {object}   sessionData    The session data
 * @param      {object}   store          The store
 * @param      {object}   Locale         The locale
 * @return     {Promise}  { description_of_the_return_value }
 */
export default function loadData(params, startingState, sessionData, store, Locale) {
	return new Promise((resolve) => {
		if (typeof store !== 'undefined' && ('url' in params) && ('languageTag' in params)) {
			const BIBLE 						= new RegExp('^\/bible$') // /bible
			const BIBLE_WITH_REF		= /^\/bible\/[0-9]+/ // /bible/1/***
			const language_tag = Locale.locale3

			let localeVersionList = [ 1 ]
			const immLocaleVersions = Immutable.fromJS(localeVersions)
			if (immLocaleVersions.hasIn([ Locale.locale, 'text' ])) {
				localeVersionList = immLocaleVersions.getIn([ Locale.locale, 'text' ]).toJS()
			} else if (immLocaleVersions.hasIn([ Locale.locale2, 'text' ])) {
				localeVersionList = immLocaleVersions.getIn([ Locale.locale2, 'text' ]).toJS()
			}

			const version = params.version
				|| cookie.load('version')
				|| ((Array.isArray(localeVersionList)) ? localeVersionList[0] : false)
				|| '1'

			let reference = params.ref || cookie.load('last_read') || 'JHN.1'
			reference = reference.toUpperCase()

			let auth = false
			if (sessionData.email && sessionData.password) {
				auth = { username: sessionData.email, password: sessionData.password }
			} else if (sessionData.tp_token) {
				auth = { tp_token: sessionData.tp_token }
			}

			const loadChapter = (finalParams) => {
				store.dispatch(BibleActionCreator.readerLoad(finalParams, auth)).then(() => {
					resolve()
				}, () => {
					store.dispatch(BibleActionCreator.handleInvalidReference(finalParams, auth)).then(() => {
						resolve()
					})
				})
			}

			const loadVerse = (finalParams) => {
				store.dispatch(PassageActionCreator.passageLoad(finalParams, auth)).then(() => {
					resolve()
				})
			}

			if (BIBLE.test(params.url)) {
				reference = reference.split('.').slice(0, 2).join('.')
				loadChapter({ isInitialLoad: true, hasVersionChanged: true, hasChapterChanged: true, language_tag, version, reference })
			} else if (BIBLE_WITH_REF.test(params.url)) {
				const { isVerse, isChapter } = isVerseOrChapter(reference)
				if (isVerse) {
					reference = reference.split('.').slice(0, 3).join('.')
					loadVerse({
						isInitialLoad: true,
						hasVersionChanged: true,
						hasChapterChanged: true,
						versions: [ parseInt(version, 10), ...params.altVersions[startingState.serverLanguageTag].text ],
						language_tag: Locale.planLocale,
						passage: reference
					})
				} else if (isChapter) {
					reference = reference.split('.').slice(0, 2).join('.')
					loadChapter({
						isInitialLoad: true,
						hasVersionChanged: true,
						hasChapterChanged: true,
						hasParallelVersionChanged: !!params.parallelVersion,
						language_tag,
						version,
						reference,
						parallelVersion: params.parallelVersion
					})

				// We found a bad USFM before making an API call,
				// let's be more efficient by falling back to our
				// last_read cookie or JHN.1 prior to making API
				// call.
				} else {
					reference = cookie.load('last_read') || 'JHN.1'
					reference = reference.split('.').slice(0, 2).join('.')
					loadChapter({
						isInitialLoad: true,
						hasVersionChanged: true,
						hasChapterChanged: true,
						language_tag,
						version,
						reference
					})
				}
			} else {
				resolve()
			}

		} else {
			resolve()
		}
	})
}
