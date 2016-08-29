import ActionCreator from '../../features/PlanDiscovery/actions/creators'

export default function loadData(params, startingState, sessionData, store) {

	return new Promise((resolve, reject) => {
		if (typeof store !== 'undefined' && params.hasOwnProperty('url') && params.hasOwnProperty('languageTag')) {
			const isCollection = new RegExp("^\/reading-plans-collection\/[0-9]+")
			const isIndex = new RegExp("^\/reading-plans$")
			const isSaved = new RegExp("^\/saved-plans-collection$")
			const isRecommended = new RegExp("^\/recommended-plans-collection\/[0-9]+")
			const isPlan = new RegExp("^\/reading-plans\/[0-9]+")
			const auth = (sessionData.email && sessionData.password) ? { username: sessionData.email, password: sessionData.password } : false

			if (isIndex.test(params.url)) {
				store.dispatch(ActionCreator.discoverAll({ language_tag: params.languageTag }, auth)).then(() => {
					resolve()
				})
			} else if (isSaved.test(params.url)) {
				store.dispatch(ActionCreator.savedPlanInfo({ context: 'saved' }, auth)).then(() => {
					resolve()
				})
			} else if (params.hasOwnProperty("id")) {
				if (isCollection.test(params.url)) {
					store.dispatch(ActionCreator.collectionAll({ id: params.id })).then(() => {
						resolve()
					})
				} else if (isPlan.test(params.url)) {
					store.dispatch(ActionCreator.readingplanInfo({ id: params.id, language_tag: params.languageTag }, auth)).then(() => {
						resolve()
					})
				} else if (isRecommended.test(params.url)) {
					store.dispatch(ActionCreator.recommendedPlansInfo({ context: 'recommended', id: params.id, language_tag: params.languageTag }, auth)).then(() => {
						resolve()
					})
				} else {
					resolve()
				}
			} else {
				resolve()
			}

		} else {
			resolve()
		}

	})
}