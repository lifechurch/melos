import ActionCreators from '../../features/PlanDiscovery/actions/creators'

export default function loadData(params, startingState, sessionData, store, Locale) {
	return new Promise((resolve, reject) => {
		if (typeof store !== 'undefined' && params.hasOwnProperty('url') && params.hasOwnProperty('languageTag')) {
			const isSubscribeUser = new RegExp("^\/reading-plans\/[0-9]+\\?subscribe=true")
			const auth = (sessionData.email && sessionData.password) ? { username: sessionData.email, password: sessionData.password } : false
			if (isSubscribeUser.test(params.url)) {
				store.dispatch(ActionCreators.readingplanView({ id: params.id, language_tag: Locale.planLocale }, auth)).then(() => {
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