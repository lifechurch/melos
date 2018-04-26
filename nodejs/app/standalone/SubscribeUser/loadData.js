import ActionCreators from '../../features/PlanDiscovery/actions/creators'

export default function loadData(params, startingState, sessionData, store, Locale) {
	return new Promise((resolve, reject) => {
		if (typeof store !== 'undefined' && params.hasOwnProperty('url') && params.hasOwnProperty('languageTag')) {
			const isSubscribeUser = new RegExp('^\/reading-plans\/[0-9a-zA-Z-]+\\?subscribe=true')

			let auth = false
			if (sessionData && sessionData.tp_token) {
				auth = { tp_token: sessionData.tp_token }
			} else if (sessionData && sessionData.email && sessionData.password) {
				auth = { username: sessionData.email, password: sessionData.password }
			}

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