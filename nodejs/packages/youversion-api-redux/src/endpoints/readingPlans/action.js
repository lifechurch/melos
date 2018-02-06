import Immutable from 'immutable'
import actionGenerator from '../../generators/action'


const readingPlans = actionGenerator({
	endpoint: 'reading-plans',
	version: '3.1',
})

export default readingPlans
