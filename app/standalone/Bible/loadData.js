import cookie from 'react-cookie';

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
			const CHAPTER_NOTV 			= new RegExp('^\/bible\/[0-9]+\/[0-9a-zA-Z]+\.[0-9a-zA-Z]+$') 																				// /bible/1/mat.1
			const VERSE_NOTV 				= new RegExp('^\/bible\/[0-9]+\/[0-9a-zA-Z]+\.[0-9a-zA-Z]+\.[0-9\-,]+$') 															// /bible/1/mat.1.1
			const CHAPTER  					= /^\/bible\/[0-9]+\/[0-9a-zA-Z]+\.[0-9a-zA-Z]+\.([^\u0000-\u007F]|\w|[0-9-])+$/												// /bible/1/mat.1.kjv
			const VERSE  						= /^\/bible\/[0-9]+\/[0-9a-zA-Z]+\.[0-9a-zA-Z]+\.[0-9\-,]+\.([^\u0000-\u007F]|\w|[0-9-])+$/ 			// /bible/1/mat.1.1-4,6.kjv
			const CHAPTER_NOTV_CV  	= new RegExp('^\/bible\/[a-zA-z]+\/[0-9a-zA-Z]+\.[0-9a-zA-Z]+$') 																			// /bible/kjv/mat.1
			const VERSE_NOTV_CV  		= new RegExp('^\/bible\/[a-zA-z]+\/[0-9a-zA-Z]+\.[0-9a-zA-Z]+\.[0-9\-,]+$') 													// /bible/kjv/mat.1.1-3,5
			const CHAPTER_CV  			= /^\/bible\/[a-zA-z]+\/[0-9a-zA-Z]+\.[0-9a-zA-Z]+\.([^\u0000-\u007F]|\w|[0-9-])+$/ 							// /bible/kjv/mat.1.kjv
			const VERSE_CV 					= /^\/bible\/[a-zA-z]+\/[0-9a-zA-Z]+\.[0-9a-zA-Z]+\.[0-9\-,]+\.([^\u0000-\u007F]|\w|[0-9-])+$/ 	// /bible/kjv/mat.1.1.kjv

			const language_tag = Locale.locale3
			const version = params.version || cookie.load('version') || '1'
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
				}, (err) => {
					store.dispatch(BibleActionCreator.handleInvalidReference(finalParams, auth)).then((d) => {
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
			} else if (CHAPTER_NOTV.test(params.url)
				|| CHAPTER.test(params.url)
				|| CHAPTER_NOTV_CV.test(params.url)
				|| CHAPTER_CV.test(params.url)) {
				reference = reference.split('.').slice(0, 2).join('.')
				loadChapter({
					isInitialLoad: true,
					hasVersionChanged: true,
					hasChapterChanged: true,
					language_tag,
					version,
					reference
				})

			} else if (VERSE_NOTV.test(params.url)
			|| VERSE.test(params.url)
			|| VERSE_NOTV_CV.test(params.url)
			|| VERSE_CV.test(params.url)) {
				reference = reference.split('.').slice(0, 3).join('.')
				loadVerse({
					isInitialLoad: true,
					hasVersionChanged: true,
					hasChapterChanged: true,
					versions: [ parseInt(version, 10), ...params.altVersions[startingState.serverLanguageTag].text ],
					language_tag: Locale.planLocale,
					passage: reference
				})

			} else {
				resolve()

			}

		} else {
			resolve()
		}
	})
}
