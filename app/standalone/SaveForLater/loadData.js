import ActionCreators from '../../features/PlanDiscovery/actions/creators'

export default function loadData(params, startingState, sessionData, store, Locale) {
	return new Promise((resolve, reject) => {
		if (typeof store !== 'undefined' && params.hasOwnProperty('url') && params.hasOwnProperty('languageTag')) {
			const isSaveForLater = new RegExp("^\/reading-plans\/[0-9]+/save-for-later")
			const auth = (sessionData.email && sessionData.password) ? { username: sessionData.email, password: sessionData.password } : false
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