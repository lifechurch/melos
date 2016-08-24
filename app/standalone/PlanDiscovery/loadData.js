import ActionCreator from '../../features/PlanDiscovery/actions/creators'

export default function loadData(params, startingState, sessionData, store) {
	console.log("++SA-LoadData", 0)

	return new Promise((resolve, reject) => {
		console.log("++SA-LoadData", 1, typeof store, params)
		if (typeof store !== 'undefined' && params.hasOwnProperty('url') && params.hasOwnProperty('languageTag')) {
			console.log("++SA-LoadData", 2)
			const isCollection = new RegExp("^\/reading-plans-collection\/[0-9]+")
			const isIndex = new RegExp("^\/reading-plans$")
			const isPlan = new RegExp("^\/reading-plans\/[0-9]+")

			console.log("++IsPlan?", isPlan.test(params.url))
			const auth = (sessionData.email && sessionData.password) ? { username: sessionData.email, password: sessionData.password } : false
			console.log("+-+-auth", auth)
			if (isIndex.test(params.url)) {
				console.log("++SA-LoadData", 4)
				store.dispatch(ActionCreator.discoverAll({ language_tag: params.languageTag }, auth)).then(() => {
					console.log("++SA-LoadData", 12)
					resolve()
				})
			} else if (params.hasOwnProperty("id")) {
				console.log("++SA-LoadData", 5)
				if (isCollection.test(params.url)) {
					console.log("++SA-LoadData", 9)
					store.dispatch(ActionCreator.collectionAll({ id: params.id })).then(() => {
						console.log("++SA-LoadData", 10)
						resolve()
					})
				} else if (isPlan.test(params.url)) {
					console.log("++SA-LoadData", 6)
					store.dispatch(ActionCreator.readingplanInfo({ id: params.id, language_tag: params.languageTag }, auth)).then(() => {
						console.log("++SA-LoadData", 11)
						resolve()
					})
				} else {
					console.log("++SA-LoadData", 7)
					resolve()
				}
			} else {
				console.log("++SA-LoadData", 8)
				resolve()
			}

		} else {
			console.log("++SA-LoadData", 3)
			resolve()
		}

	})
}