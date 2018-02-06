import actionGenerator from '../../generators/action'

const users = actionGenerator({
	endpoint: 'users',
	version: '3.1',
})

export default users
