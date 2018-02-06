import Immutable from 'immutable'
import reducerGenerator from '../../generators/reducer'

export const getNotifications = (state) => {
	const immState = Immutable.fromJS(state)
	const key = [ 'api', 'notifications', 'items', 'response' ]
	return immState.hasIn(key)
		? immState.getIn(key).toJS()
		: null
}

export const unsubscribeStatus = (state) => {
	const unsubscribe = state.api.notifications.unsubscribe

	if (typeof unsubscribe !== 'object') {
		return 'other'
	}

	if (unsubscribe.loading === true) {
		return 'loading'
	}

	if (Array.isArray(unsubscribe.errors) && unsubscribe.errors.length > 0) {
		return 'error'
	}

	if (typeof unsubscribe === 'object') {
		return 'success'
	}

	return state
}

export const unsubscribeErrors = (state) => {
	const unsubscribe = state.api.notifications.unsubscribe

	if (typeof unsubscribe !== 'object' || !Array.isArray(unsubscribe.errors)) {
		return []
	}

	return unsubscribe.errors
}

export const isLoggedIn = (state) => {
	return state.auth.isLoggedIn
}

export const getNotificationSettings = (state) => {
	const settings = Immutable.fromJS(state).getIn([ 'api', 'notifications', 'settings', 'response', 'notification_settings' ])
	if (settings) {
		return settings.toJS()
	}
	return {}
}

export const getVOTDSubscription = (state) => {
	const subscription = Immutable.fromJS(state).getIn([ 'api', 'notifications', 'votd_subscription', 'response' ])
	if (subscription) {
		return subscription.toJS()
	}
	return {}
}

const methodDefinitions = {
	votd_subscription: {
		failure: ({ state, key, api_errors }) => {
			if (key) {
				let response, errors
				if (Array.isArray(api_errors) &&
					api_errors.length > 0 &&
					api_errors[0].key === 'notifications.votd_subscription.not_found') {
					errors = null
					response = {
						push: {
							version_id: null,
							time: null
						},
						email: {
							version_id: null,
							time: null
						},
						image_email: {
							language_tag: null,
							time: null
						}
					}
				} else {
					errors = api_errors
				}
				return Immutable.fromJS(state)
					.mergeDeepIn(key, {
						loading: false,
						errors,
						response
					})
					.toJS()
			} else {
				return state
			}
		}
	},
	update: {
		success: ({ state }) => {
			// reset new notifications count
			if (state.items && state.items.response && state.items.response.new_count) {
				return Immutable
					.fromJS(state)
					.setIn(['items', 'response', 'new_count'], 0)
					.toJS()
			}

			return state
		}
	}
}

const notificationsReducer = reducerGenerator('notifications', methodDefinitions)

export default notificationsReducer
