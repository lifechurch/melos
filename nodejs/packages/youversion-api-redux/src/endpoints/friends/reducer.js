import Immutable from 'immutable'
import reducerGenerator from '../../generators/reducer'

export const getFriends = (state) => {
	return 'items' in state.api.friends
		? state.api.friends.items
		: null
}

const methodDefinitions = {
	items: {
		success: ({ state, params, response }) => {
			let returnVal = state
			if (response) {
				let prevUsers = []
				let newUsers = []
				if (Immutable
					.fromJS(state)
					.hasIn(['items', 'response', 'users'], [])
				) {
					prevUsers = Immutable
						.fromJS(state)
						.getIn(['items', 'response', 'users'], [])
						.toJS()
				}
				if (Immutable
					.fromJS(response)
					.hasIn(['users'], [])
				) {
					newUsers = Immutable
						.fromJS(response)
						.getIn(['users'], [])
						.toJS()
				}
				const mergedResponse = Immutable
					.fromJS(response)
					.setIn(['users'], prevUsers.concat(newUsers))
					.toJS()
				returnVal = Immutable
					.fromJS(state)
					.mergeDeepIn(['items', 'response'], mergedResponse)
					.toJS()
			}
			return Immutable
				.fromJS(returnVal)
				.mergeDeepIn(['items', 'loading'], false)
				.toJS()
		}
	}
}

const friendsReducer = reducerGenerator('friends', methodDefinitions)

export default friendsReducer
