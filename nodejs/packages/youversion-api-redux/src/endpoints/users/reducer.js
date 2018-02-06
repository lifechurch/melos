import Immutable from 'immutable'
import reducerGenerator from '../../generators/reducer'

export const getUsers = (state) => {
	return state.api.users
		&& state.api.users.view
		? state.api.users.view
		: null
}

export const getUserById = (state, id) => {
	return typeof state.api.users.view === 'object' ? state.api.users.view[id] : null
}

export const getTokenIdentity = (state) => {
	const tokenIdentity = Immutable.fromJS(state).getIn([ 'api', 'users', 'token_identity' ])

	let response, loading, email, languageTag
	if (tokenIdentity) {
		response = tokenIdentity.get('response')
		loading = tokenIdentity.get('loading')

		if (response) {
			email = response.get('email')
			languageTag = response.get('language_tag')
		}
	}
	return { email, languageTag, loading }
}

export const getLoggedInUser = (state) => {
	return Immutable.fromJS(state).getIn([ 'auth', 'userData' ]).toJS()
}

const methodDefinitions = {

}

const usersReducer = reducerGenerator('users', methodDefinitions)

export default usersReducer
