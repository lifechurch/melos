import Immutable from 'immutable'
import reducerGenerator from '../../generators/reducer'

export const getSearchUsers = (state) => {
	return 'search' in state.api
		&& 'users' in state.api.search
		&& state.api.search.users.response
		? state.api.search.users.response.users
		: null
}
export const getSearchPlans = (state) => {
	return 'search' in state.api
		&& 'reading_plans' in state.api.search
		? state.api.search.reading_plans
		: null
}

const methodDefinitions = {
	reading_plans: {
		key: ({ params }) => {
			return [ 'reading_plans', params.query ]
		},
		success: ({ state, response, key }) => {
			if (response) {
				return Immutable
					.fromJS(state)
					.mergeDeepIn(key, response)
					.toJS()
			}
			return state
		}
	}
}

const searchReducer = reducerGenerator('search', methodDefinitions)

export default searchReducer
