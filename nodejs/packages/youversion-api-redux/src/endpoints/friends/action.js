import actionGenerator from '../../generators/action'

const friends = actionGenerator({
	endpoint: 'friends',
	version: '3.1',
})

export default friends
