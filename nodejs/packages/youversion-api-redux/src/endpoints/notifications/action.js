import actionGenerator from '../../generators/action'

const notificationsActions = actionGenerator({
	endpoint: 'notifications',
	version: '3.1',
	methodDefinitions: {
		unsubscribe: {
			http_method: 'post'
		},
		update: {
			http_method: 'post'
		},
		update_settings: {
			http_method: 'post'
		},
		update_votd_subscription: {
			http_method: 'post',
		}
	}
})

export default notificationsActions
