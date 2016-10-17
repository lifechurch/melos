import { getClient } from '@youversion/js-api'

export default function loadData(params, startingState, sessionData) {
	return new Promise((resolve, reject) => {
		const client = getClient('events')
			.call('view')
			.setVersion('3.2')
			.setEnvironment(process.env.NODE_ENV)
			.params({ id: params.id })

		if (startingState.auth.isLoggedIn === true) {
			if (typeof sessionData.email !== 'undefined') {
				client.auth(sessionData.email , sessionData.password)
			} else {
				client.auth(sessionData.tp_token)
			}
		}

		client.get().then((response) => {
			if (typeof response.errors !== 'undefined') {
				return reject({error:4, message: 'Could not load data.'})
			}
			return resolve({ type: 'EVENT_VIEW_SUCCESS', response })
		}, (error) => {
			return reject({error:99, message: 'Unknown Error', full: error})
		})
	})
}