import userAction from '@youversion/api-redux/lib/endpoints/users/action'

export default function loadData(params, startingState, sessionData, store, Locale) {
	return new Promise((resolve) => {
		if (typeof store !== 'undefined') {
			store.dispatch(userAction({
				method: 'view',
				params: { id: startingState.userId }
			})).then(() => {
				resolve()
			})
		} else {
			resolve()
		}
	})
}
