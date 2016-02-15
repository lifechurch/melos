const constants = {
	new: 'CONTENT_NEW',
	addRequest: 'CONTENT_ADD_REQUEST',
	addSuccess: 'CONTENT_ADD_SUCCESS',
	addFailure: 'CONTENT_ADD_FAILURE',
	updateRequest: 'CONTENT_UPDATE_REQUEST',
	updateSuccess: 'CONTENT_UPDATE_SUCCESS',
	updateFailure: 'CONTENT_UPDATE_FAILURE',
	removeRequest: 'CONTENT_REMOVE_REQUEST',
	removeSuccess: 'CONTENT_REMOVE_SUCCESS',
	removeFailure: 'CONTENT_REMOVE_FAILURE',
	reorderRequest: 'CONTENT_REORDER_REQUEST',
	reorderSuccess: 'CONTENT_REORDER_SUCCESS',
	reorderFailure: 'CONTENT_REORDER_FAILURE',
	setField: 'CONTENT_SET_FIELD',
	setPlanField: 'SET_PLAN_FIELD',
	selectPlan: 'SELECT_PLAN',
	searchPlansRequest: 'SEARCH_PLANS_REQUEST',
	searchPlansSuccess: 'SEARCH_PLANS_SUCCESS',
	searchPlansFailure: 'SEARCH_PLANS_FAILURE',
	focusPlanSearch: 'FOCUS_PLAN_SEARCH',
	clearPlanSearch: 'CLEAR_PLAN_SEARCH',
	move: 'CONTENT_MOVE',
	startReorder: 'CONTENT_START_REORDER'
}

export default function (key) {
	if (typeof key === 'string' && constants.hasOwnProperty(key)) {
		return constants[key];
	} else {
		throw new Error('Invalid Content Action: ' + key)
	}
}
