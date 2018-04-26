import ActionCreators from '../../features/PlanDiscovery/actions/creators'

export default function loadData(params, startingState, sessionData, store, Locale) {
	return new Promise((resolve, reject) => {
		if (typeof store !== 'undefined' && params.hasOwnProperty('url') && params.hasOwnProperty('languageTag')) {
			const isSaveForLater = new RegExp('^\/reading-plans\/[0-9a-zA-Z-]+\\?add_to_queue=true')

			let auth = false
			if (sessionData && sessionData.tp_token) {
				auth = { tp_token: sessionData.tp_token }
			} else if (sessionData && sessionData.email && sessionData.password) {
				auth = { username: sessionData.email, password: sessionData.password }
			}

			if (isSaveForLater.test(params.url)) {
				Promise.all([
					store.dispatch(ActionCreators.readingplanView({ id: params.id, language_tag: Locale.planLocale }, auth)),
					store.dispatch(ActionCreators.readingplanSaveforlater({ id: params.id }, auth))
				]).then(() => {
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