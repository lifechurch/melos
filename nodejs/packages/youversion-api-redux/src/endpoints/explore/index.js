import Immutable from 'immutable'
import apiEndpoint from '../../generators/apiEndpoint'



// SELECTORS -------------------------------------------------------------------
export const getTopics = (state) => {
	return state.explore
		&& state.explore.topics
		&& state.explore.topics.data
}
export const getTopic = (state) => {
	return state.explore
		&& state.explore.topic
		&& state.explore.topic.data
}

// RESTFUL API ENDPOINT --------------------------------------------------------
// https://nodejs.bible.com -> https://explore.youversionapi.com
const endpoint = 'explore'

const methods = {
	topics: {
		url: '/4.0/topics',
	},
	topic: {
		url: '/4.0/topics/:topic',
		transformer: (data, prevData, action) => {
			if (data && action.request.pathvars) {
				const { request: { pathvars: { topic } } } = action
				return Immutable
					.fromJS(prevData || {})
					.mergeDeep({ [topic]: data })
					.toJS()
			}
			return prevData || {}
		}
	}
}

const exploreEndpoint = apiEndpoint(endpoint, methods)

export default exploreEndpoint
