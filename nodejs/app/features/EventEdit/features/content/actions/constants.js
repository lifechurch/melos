const constants = {
	new: 'CONTENT_NEW',
	versionsRequest: 'VERSIONS_REQUEST',
	versionsSuccess: 'VERSIONS_SUCCESS',
	versionsFailure: 'VERSIONS_FAILURE',
	versionRequest: 'VERSION_REQUEST',
	versionSuccess: 'VERSION_SUCCESS',
	versionFailure: 'VERSION_FAILURE',
	chapterRequest: 'CHAPTER_REQUEST',
	chapterSuccess: 'CHAPTER_SUCCESS',
	chapterFailure: 'CHAPTER_FAILURE',
	chapterClear: 'CHAPTER_CLEAR',
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
	setInsertionPoint: 'CONTENT_SET_INSERTION_POINT',
	setLang: 'CONTENT_SET_LANG',
	setField: 'CONTENT_SET_FIELD',
	setPlanField: 'SET_PLAN_FIELD',
	selectPlan: 'SELECT_PLAN',
	setReference: 'SET_REFERENCE',
	clearReference: 'CLEAR_REFERENCE',
	searchPlansRequest: 'SEARCH_PLANS_REQUEST',
	searchPlansSuccess: 'SEARCH_PLANS_SUCCESS',
	searchPlansFailure: 'SEARCH_PLANS_FAILURE',
	focusPlanSearch: 'FOCUS_PLAN_SEARCH',
	clearPlanSearch: 'CLEAR_PLAN_SEARCH',
	move: 'CONTENT_MOVE',
	startReorder: 'CONTENT_START_REORDER',
	initUpload: 'INIT_UPLOAD',
	initUploadSuccess: 'INIT_UPLOAD_SUCCESS',
	initUploadFailure: 'INIT_UPLOAD_FAILURE'
}

export default function (key) {
	if (typeof key === 'string' && constants.hasOwnProperty(key)) {
		return constants[key];
	} else {
		throw new Error(`Invalid Content Action: ${key}`)
	}
}
