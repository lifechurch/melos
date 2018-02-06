import Immutable from 'immutable'
import actionGenerator from '../../generators/action'


const audioActions = actionGenerator({
	endpoint: 'audio-bible',
	version: '3.1',
})

export default audioActions
