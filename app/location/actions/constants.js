import { ActionNamespacer } from '../../lib/ActionNamespacer'
const namespace = 'Location'

const actions = [
	'ADD',
	'REMOVE_REQUEST',
	'REMOVE_SUCCESS',
	'REMOVE_FAILURE',
	'EDIT',
	'CANCEL_EDIT',
	'SET_FIELD',
	'SET_PLACE',
	'TIMEZONE_SUCCESS',
	'TIMEZONE_FAILURE',
	'SET_TIME',
	'ADD_TIME',
	'SAVE',
	'CREATE_REQUEST',
	'CREATE_SUCCESS',
	'CREATE_FAILURE'
]

const actionConstants = ActionNamespacer(namespace, actions)

export default actionConstants