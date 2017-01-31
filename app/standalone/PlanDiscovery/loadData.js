import ActionCreator from '../../features/PlanDiscovery/actions/creators'
import cookie from 'react-cookie';

export default function loadData(params, startingState, sessionData, store, Locale) {

	return new Promise((resolve, reject) => {
		if (typeof store !== 'undefined' && params.hasOwnProperty('url') && params.hasOwnProperty('languageTag')) {
			const isCollection = new RegExp("^\/reading-plans-collection\/[0-9]+")
			const isIndex = new RegExp("^\/reading-plans$")
			const isSaved = new RegExp("^\/saved-plans-collection$")
			const isRecommended = new RegExp("^\/recommended-plans-collection\/[0-9]+")
			const isPlan = new RegExp("^\/reading-plans\/[0-9]+")

			const isSubscribedPlans = new RegExp("^\/users\/[^\r\n\t\f\/ ]+\/reading-plans")
			const isSavedPlans = new RegExp("^\/users\/[^\r\n\t\f\/ ]+\/saved-reading-plans")
			const isCompletedPlans = new RegExp("^\/users\/[^\r\n\t\f\/ ]+\/completed-reading-plans")

			const isSubscription = new RegExp("^\/users\/[^\r\n\t\f\/ ]+\/reading-plans\/[0-9]+-[^\r\n\t\f\/ ]+")

			let auth = false

			if (sessionData.email && sessionData.password) {
				auth = { username: sessionData.email, password: sessionData.password }
			} else if (sessionData.tp_token) {
				auth = { tp_token: sessionData.tp_token }
			}

			if (isIndex.test(params.url)) {
				store.dispatch(ActionCreator.discoverAll({ language_tag: Locale.planLocale }, auth)).then(() => {
					resolve()
				})
			} else if (isSaved.test(params.url)) {
				store.dispatch(ActionCreator.savedPlanInfo({ context: 'saved' }, auth)).then(() => {
					resolve()
				})
			} else if (isSubscription.test(params.url)) {
				const version = params.version || cookie.load('version') || '1'
				store.dispatch(ActionCreator.subscriptionAll({ id: params.id, language_tag: Locale.planLocale, user_id: sessionData.userid, version, day: params.day }, auth)).then((d) => {
					resolve()
				})
			} else if (isSubscribedPlans.test(params.url)) {
				store.dispatch(ActionCreator.items({ page: 1, user_id: sessionData.userid }, auth)).then((d) => {
					resolve()
				})
			} else if (isSavedPlans.test(params.url)) {
				store.dispatch(ActionCreator.savedItems({ page: 1 }, auth)).then((d) => {
					resolve()
				})
			} else if (isCompletedPlans.test(params.url)) {
				store.dispatch(ActionCreator.completed({ page: 1, user_id: sessionData.userid }, auth)).then((d) => {
					resolve()
				})
			} else if (params.hasOwnProperty("id")) {
				if (isCollection.test(params.url)) {
					store.dispatch(ActionCreator.collectionAll({ id: params.id })).then(() => {
						resolve()
					})
				} else if (isPlan.test(params.url)) {
					store.dispatch(ActionCreator.readingplanInfo({ id: params.id, language_tag: Locale.planLocale }, auth)).then(() => {
						resolve()
					})
				} else if (isRecommended.test(params.url)) {
					store.dispatch(ActionCreator.recommendedPlansInfo({ context: 'recommended', id: params.id, language_tag: Locale.planLocale }, auth)).then(() => {
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