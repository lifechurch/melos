import Immutable from 'immutable'
import reducerGenerator from '../../generators/reducer'

export const getVerseColors = (state) => {
	return state.api.moments
		&& state.api.moments.verse_colors
		&& state.api.moments.verse_colors.response
		? state.api.moments.verse_colors.response.verse_colors
		: null
}
export const getColors = (state) => {
	return state.api.moments
		&& state.api.moments.colors
		&& state.api.moments.colors.response
		? state.api.moments.colors.response.colors
		: null
}
export const getLabels = (state) => {
	return state.api.moments
		&& state.api.moments.labels
		&& state.api.moments.labels.response
		? state.api.moments.labels.response.labels
		: null
}
export const getConfiguration = (state) => {
	return state.api.moments
		&& state.api.moments.configuration
		&& state.api.moments.configuration.response
		? state.api.moments.configuration.response
		: null
}
export const getVotd = (state) => {
	return state.api.moments
		&& state.api.moments.votd
		&& state.api.moments.votd.response
		? state.api.moments.votd.response.votd
		: null
}

const momentsReducer = reducerGenerator('moments', {
	verse_colors: {
		// we want to overwrite state
		success: ({ state, response, key }) => {
			return Immutable.fromJS(state)
				.setIn(key, {
					loading: false,
					errors: false,
					response,
				})
				.toJS()
		}
	}
})

export default momentsReducer
