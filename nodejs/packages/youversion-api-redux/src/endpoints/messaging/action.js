import actionGenerator from '../../generators/action'

const messaging = actionGenerator({
	endpoint: 'messaging',
	version: '3.1',
	methodDefinitions: {
		register: {
			http_method: 'post',
		}
	}
})

export default messaging
