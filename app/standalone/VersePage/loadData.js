import ActionCreators from '../../features/PlanDiscovery/actions/creators'

export default function loadData(params, startingState, sessionData, store, Locale) {
	return new Promise((resolve, reject) => {
		if (typeof store !== 'undefined' && params.hasOwnProperty('url') && params.hasOwnProperty('languageTag')) {
			const isReference = new RegExp("^\/bible\/([0-9]{1}[a-z]{2}|[a-z]{3})\.[0-9]+\.[0-9]+")
			const auth = (sessionData.email && sessionData.password) ? { username: sessionData.email, password: sessionData.password } : false

			if (isReference.test(params.url)) {
				console.log('isreference')
				store.dispatch(ActionCreators.versePageView({ id: params.id, language_tag: Locale.planLocale }, auth)).then(() => {
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