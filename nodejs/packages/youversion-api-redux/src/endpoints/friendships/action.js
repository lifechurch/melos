import actionGenerator from '../../generators/action'

const friendships = actionGenerator({
	endpoint: 'friendships',
	version: '3.1',
})

export default friendships
