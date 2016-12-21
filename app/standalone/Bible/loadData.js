import ActionCreator from '../../features/Bible/actions/creators'
import cookie from 'react-cookie';

export default function loadData(params, startingState, sessionData, store, Locale) {

	return new Promise((resolve, reject) => {
		if (typeof store !== 'undefined' && params.hasOwnProperty('url') && params.hasOwnProperty('languageTag')) {
			let lang = Locale.locale3
			let version = params.version || cookie.load('version') || '1'
			// let ref = null
			// if (params.ref) {
			// 	let refString = params.ref.split('.')
			// 	if (indexOf(refString[2]) && typeof refString[2] == 'string') {
			// 		ref = refString.slice(0, 2).join('.')
			// 	} else {
			// 		ref = params.ref
			// 	}
			// }
			// console.log(ref)
			// // const isRef = new RegExp("^([0-9]{1}[a-z]{2}|[a-z]{3})\.[0-9]+)?")
			// // isRef.test(ref)

			let reference = params.ref || cookie.load('last_read') || 'MAT.1'
			reference = reference.toUpperCase()
// const isReference = new RegExp("^\/bible\/([0-9]{1}[a-z]{2}|[a-z]{3})\.[0-9]+\.[0-9]+")
      const isChapter = new RegExp("^\/bible(\/[0-9]+\/([0-9]{1}[a-z]{2}|[a-z]{3})\.[0-9]+)?")
			if (isChapter.test(params.url)) {
				let auth = false
				if (sessionData.email && sessionData.password) {
					auth = { username: sessionData.email, password: sessionData.password }
				} else if (sessionData.tp_token) {
					auth = { tp_token: sessionData.tp_token }
				}

				store.dispatch(ActionCreator.readerLoad({ language_tag: lang, version: version, reference: reference, params }, auth)).then(() => {
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