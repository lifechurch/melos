import Immutable from 'immutable'
import actionGenerator from '../../generators/action'


const bibleActions = actionGenerator({
	endpoint: 'bible',
	version: '3.1',
})

export default bibleActions
