import actionGenerator from '../../generators/action'

const streaksActions = actionGenerator({
	endpoint: 'streaks',
	version: '3.2',
	methodDefinitions: {
		checkin: {
			http_method: 'post'
		}
	}
})

export default streaksActions
