import ActionCreators from '../../features/Passage/actions/creators'

export default function loadData(params, startingState, sessionData, store, Locale) {
	return new Promise((resolve, reject) => {
		if (typeof store !== 'undefined' && params.hasOwnProperty('url') && params.hasOwnProperty('languageTag')) {
			const isReference = new RegExp("^\/passage\/([0-9]{1}[a-zA-Z]{2}|[a-zA-Z]{3})\.[0-9]+\.[0-9]+")
			const auth = (sessionData.email && sessionData.password) ? { username: sessionData.email, password: sessionData.password } : false

			if (isReference.test(params.url)) {
				console.log('isreference')
				store.dispatch(ActionCreators.passageLoad({ versions: params.versions, language_tag: Locale.planLocale, passage: params.ref }, auth)).then(() => {
					console.log('success!')
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