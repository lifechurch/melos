import ActionCreator from '../../features/Bible/actions/creators'
import cookie from 'react-cookie';

export default function loadData(params, startingState, sessionData, store, Locale) {

	return new Promise((resolve, reject) => {
		if (typeof store !== 'undefined' && params.hasOwnProperty('url') && params.hasOwnProperty('languageTag')) {
			let lang = Locale.locale3
			let version = params.version || cookie.load('version') || 1
			let reference = params.ref || cookie.load('last_read') || 'MAT.1'
			reference = reference.toUpperCase()
// const isReference = new RegExp("^\/bible\/([0-9]{1}[a-z]{2}|[a-z]{3})\.[0-9]+\.[0-9]+")
      const isChapter = new RegExp("^\/bible\/[0-9]+\/([0-9]{1}[a-z]{2}|[a-z]{3})\.[0-9]+")
			const auth = (sessionData.email && sessionData.password) ? { username: sessionData.email, password: sessionData.password } : false

			if (isChapter.test(params.url)) {
				store.dispatch(ActionCreator.readerLoad({ language_tag: lang, version: version, reference: reference }, auth)).then(() => {
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