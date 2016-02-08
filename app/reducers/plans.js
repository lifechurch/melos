import contentType from '../features/EventEdit/features/content/actions/constants'

export default function plans(state = {}, action) {
	switch(action.type) {

		case contentType('setPlanField'):
			// Can't change 'query' to action.field, why?
			return Object.assign({}, state, {'query': action.value})

		case contentType('searchPlansRequest'):
			return Object.assign({}, state, {'items': [{'plan_id':0, 'name': {'default': 'Fetching…'}}]})

		case contentType('searchPlansSuccess'):
			return Object.assign({}, state, {'items': action.response.reading_plans})

		case contentType('searchPlansFailure'):
			return Object.assign({}, state, {'items': [{'plan_id':0, 'name': {'default': action.api_errors[0].error}}]})

		case contentType('focusPlanSearch'):
			return Object.assign({}, state, {'focus_id': action.index, 'query': '', 'items': []})

		case contentType('clearPlanSearch'):
			return Object.assign({}, state, {'query': '', 'items': []})

		default:
			return state;
	}
}
