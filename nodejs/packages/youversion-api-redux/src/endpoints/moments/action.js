import Immutable from 'immutable'
import actionGenerator from '../../generators/action'


const momentsActions = actionGenerator({
	endpoint: 'moments',
	version: '3.1',
	methodDefinitions: {
		create: {
			http_method: 'post'
		}
	}
})

export default momentsActions
