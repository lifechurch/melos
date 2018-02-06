import Immutable from 'immutable'
import reducerGenerator from '../../generators/reducer'

export const getConfiguration = (state) => {
	return state.api.readingPlans
		&& state.api.readingPlans.configuration
		&& state.api.readingPlans.configuration
		&& state.api.readingPlans.configuration.response
		? state.api.readingPlans.configuration.response
		: null
}
export const getPlanById = (state, id) => {
	return state.api.readingPlans
		&& state.api.readingPlans.view
		&& id in state.api.readingPlans.view
		&& state.api.readingPlans.view[id].response
		? state.api.readingPlans.view[id].response
		: null
}
export const getPlans = (state) => {
	return state.api.readingPlans
		&& state.api.readingPlans.view
		? state.api.readingPlans.view
		: null
}
export const getPlansByReference = (state) => {
	return state.api.readingPlans
		&& state.api.readingPlans.plans_by_reference
		? state.api.readingPlans.plans_by_reference
		: null
}
export const getAllQueueItems = (state) => {
	return state.api.readingPlans.all_queue_items
		&& 'response' in state.api.readingPlans.all_queue_items
		? state.api.readingPlans.all_queue_items.response.reading_plans
		: null
}
export const getMyPlans = (state) => {
	const myPlans = Immutable.fromJS(state).getIn([ 'api', 'readingPlans', 'items', 'response' ])
	if (myPlans !== null && typeof myPlans !== 'undefined') {
		return myPlans.toJS()
	}
	return myPlans
}


const methodDefinitions = {
	plans_by_reference: {
		key: ({ params }) => {
			return [ 'plans_by_reference', params.usfm ]
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

const readingPlansReducer = reducerGenerator('reading-plans', methodDefinitions)

export default readingPlansReducer
