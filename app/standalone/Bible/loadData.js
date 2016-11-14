import ActionCreator from '../../features/Bible/actions/creators'
import cookie from 'react-cookie';
import defaultVersions from '../../../locales/config/defaultVersions'

export default function loadData(params, startingState, sessionData, store, Locale) {

	return new Promise((resolve, reject) => {
		if (typeof store !== 'undefined' && params.hasOwnProperty('url') && params.hasOwnProperty('languageTag')) {
			let lang = Locale.locale3

      const isChapter = new RegExp("^\/bible(\/[0-9]+\/([0-9]{1}[a-zA-Z]{2}|[a-zA-Z]{3})\.[0-9]+)?")
			const isReference = new RegExp("^\/bible\/([0-9]{1}[a-zA-Z]{2}|[a-zA-Z]{3})\.[0-9]+\.[0-9]+")

			if (isChapter.test(params.url)) {
				let version = params.version || cookie.load('version') || '1'
				let reference = params.ref || cookie.load('last_read') || 'MAT.1'
				reference = reference.toUpperCase()
				let auth = false
				if (sessionData.email && sessionData.password) {
					auth = { username: sessionData.email, password: sessionData.password }
				} else if (sessionData.tp_token) {
					auth = { tp_token: sessionData.tp_token }
				}

				store.dispatch(ActionCreator.readerLoad({ language_tag: lang, version: version, reference: reference }, auth)).then(() => {
					resolve()
				})

			} else if (isReference.test(params.url)) {
				console.log('is reference')
				let verse = params.ref.toUpperCase()
				let versions = defaultVersions[lang]
				let auth = false
				if (sessionData.email && sessionData.password) {
					auth = { username: sessionData.email, password: sessionData.password }
				} else if (sessionData.tp_token) {
					auth = { tp_token: sessionData.tp_token }
				}

				store.dispatch(ActionCreator.verseLoad({ language_tag: lang, versions: versions, verse: verse }, auth)).then(() => {
					resolve()
				})
			} else {
				resolve()
			}
		} else {
			resolve()
		}

	})
}