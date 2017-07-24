import Bible from '@youversion/api-redux/lib/endpoints/bible/action'

export default function loadData(params, startingState, sessionData, store, Locale) {
	return new Promise((resolve) => {
		if (typeof store !== 'undefined' && params.url && params.languageTag) {
			store.dispatch(Bible({
				method: 'configuration',
				params: {},
				extras: {},
				auth: false
			})).then(() => {
				resolve()
			})
		} else {
			resolve()
		}
	})
}
