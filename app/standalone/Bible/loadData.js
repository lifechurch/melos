import BibleActionCreator from '../../features/Bible/actions/creators'
import PassageActionCreator from '../../features/Passage/actions/creators'
import cookie from 'react-cookie';
import defaultVersions from '../../../locales/config/defaultVersions'

export default function loadData(params, startingState, sessionData, store, Locale) {
	return new Promise((resolve, reject) => {
		if (typeof store !== 'undefined' && params.hasOwnProperty('url') && params.hasOwnProperty('languageTag')) {
			const BIBLE 						= new RegExp("^\/bible$") // /bible
			const CHAPTER_NOTV 			= new RegExp("^\/bible\/[0-9]+\/[0-9a-zA-Z]{3}\.[0-9]+$") 																// /bible/1/mat.1
			const VERSE_NOTV 				= new RegExp("^\/bible\/[0-9]+\/[0-9a-zA-Z]{3}\.[0-9]{1,3}\.[0-9\-,]+$") 									// /bible/1/mat.1.1
			const CHAPTER  					= new RegExp("^\/bible\/[0-9]+\/[0-9a-zA-Z]{3}\.[0-9]{1,3}\.[a-zA-z]{1}[a-zA-Z0-9]+$") 									// /bible/1/mat.1.kjv
			const VERSE  						= new RegExp("^\/bible\/[0-9]+\/[0-9a-zA-Z]{3}\.[0-9]{1,3}\.[0-9\-,]+\.[a-zA-z]{1}[a-zA-Z0-9]+$") 			// /bible/1/mat.1.1-4,6.kjv
			const CHAPTER_NOTV_CV  	= new RegExp("^\/bible\/[a-zA-z]{1}[a-zA-Z0-9]+\/[0-9a-zA-Z]{3}\.[0-9]{1,3}$") 													// /bible/kjv/mat.1
			const VERSE_NOTV_CV  		= new RegExp("^\/bible\/[a-zA-z]{1}[a-zA-Z0-9]+\/[0-9a-zA-Z]{3}\.[0-9]{1,3}\.[0-9\-,]+$") 							// /bible/kjv/mat.1.1-3,5
			const CHAPTER_CV  			= new RegExp("^\/bible\/[a-zA-z]{1}[a-zA-Z0-9]+\/[0-9a-zA-Z]{3}\.[0-9]{1,3}\.[a-zA-z]{1}[a-zA-Z0-9]+$") 							// /bible/kjv/mat.1.kjv
			const VERSE_CV 					= new RegExp("^\/bible\/[a-zA-z]{1}[a-zA-Z0-9]+\/[0-9a-zA-Z]{3}\.[0-9]{1,3}\.[0-9\-,]+\.[a-zA-z]{1}[a-zA-Z0-9]+$") 		// /bible/kjv/mat.1.1.kjv

			let language_tag = Locale.locale3
			let version = params.version || cookie.load('version') || '1'
			let reference = params.ref.toUpperCase() || cookie.load('last_read').toUpperCase() || 'JHN.1'

			let auth = false
			if (sessionData.email && sessionData.password) {
				auth = { username: sessionData.email, password: sessionData.password }
			} else if (sessionData.tp_token) {
				auth = { tp_token: sessionData.tp_token }
			}

			const loadChapter = (finalParams) => {
				store.dispatch(BibleActionCreator.readerLoad(finalParams, auth)).then((data) => {
					resolve()
			 	})
			}

			const loadVerse = (finalParams) => {
				store.dispatch(PassageActionCreator.passageLoad(finalParams, auth)).then(() => {
					resolve()
			 	})
			}

			if (BIBLE.test(params.url)) {
			 resolve()

			} else if (CHAPTER_NOTV.test(params.url)
			 || CHAPTER.test(params.url)
			 || CHAPTER_NOTV_CV.test(params.url)
			 || CHAPTER_CV.test(params.url)) {
			 reference = reference.split('.').slice(0,2).join('.')
			 loadChapter({ isInitialLoad: true, hasVersionChanged: true, hasChapterChanged: true, language_tag, version, reference })

			} else if (VERSE_NOTV.test(params.url)
			 || VERSE.test(params.url)
			 || VERSE_NOTV_CV.test(params.url)
			 || VERSE_CV.test(params.url)) {
			 reference = reference.split('.').slice(0,3).join('.')
			 loadVerse({
			 	isInitialLoad: true,
			 	hasVersionChanged: true,
			 	hasChapterChanged: true,
			 	versions: [ parseInt(version), ...params.altVersions[startingState.serverLanguageTag].text ],
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