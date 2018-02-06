import Immutable from 'immutable'
import reducerGenerator from '../../generators/reducer'

export const getFriendshipRequests = (state) => {
	const immState = Immutable.fromJS(state)
	const key = [ 'api', 'friendships', 'incoming', 'response' ]
	return immState.hasIn(key)
		? immState.getIn(key).toJS()
		: null
}

const friendshipsReducer = reducerGenerator('friendships', {})

export default friendshipsReducer
