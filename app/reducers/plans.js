import contentType from '../features/EventEdit/features/content/actions/constants'

export default function plans(state = {}, action) {
	switch(action.type) {

		case contentType('setPlanField'):
			// Can't change 'query' to action.field, why?
			return Object.assign({}, state, {'query': action.value})

		case contentType('searchPlansRequest'):
			return Object.assign({}, state, {'items': [{
												'plan_id':0,
												'name': {'default': 'Fetching…'},
												'formatted_length': {'default': ''},
												'images': ['','','']}]})

		case contentType('searchPlansSuccess'):
			return Object.assign({}, state, {'items': action.response.reading_plans})

		case contentType('searchPlansFailure'):
			var error_msg = action.api_errors[0].error
			if (error_msg == 'Search did not match any documents') {
				error_msg = 'No matching Plans'
			} else {
				error_msg = null
			}
			return Object.assign({}, state, {'items': [{
												'plan_id':0,
												'name': {'default': error_msg},
												'formatted_length': {'default': ''},
												'images': ['','','']}]})

		case contentType('selectPlan'):
		case contentType('focusPlanSearch'):
			return Object.assign({}, state, {'focus_id': action.index, 'query': '', 'items': []})

		case contentType('clearPlanSearch'):
			return Object.assign({}, state, {'query': '', 'items': []})

		default:
			return state;
	}
}
