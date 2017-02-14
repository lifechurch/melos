const constants = {
	discoverRequest: 'READING_PLANS_DISCOVER_REQUEST',
	discoverSuccess: 'READING_PLANS_DISCOVER_SUCCESS',
	discoverFailure: 'READING_PLANS_DISCOVER_FAILURE',
	collectionRequest: 'READING_PLANS_COLLECTION_REQUEST',
	collectionSuccess: 'READING_PLANS_COLLECTION_SUCCESS',
	collectionFailure: 'READING_PLANS_COLLECTION_FAILURE',
	collectionsItemsRequest: 'READING_PLANS_COLLECTIONS_ITEMS_REQUEST',
	collectionsItemsSuccess: 'READING_PLANS_COLLECTIONS_ITEMS_SUCCESS',
	collectionsItemsFailure: 'READING_PLANS_COLLECTIONS_ITEMS_FAILURE',
	recommendationsItemsRequest: 'READING_PLANS_RECOMMENDATION_ITEMS_REQUEST',
	recommendationsItemsSuccess: 'READING_PLANS_RECOMMENDATION_ITEMS_SUCCESS',
	recommendationsItemsFailure: 'READING_PLANS_RECOMMENDATION_ITEMS_FAILURE',

	savedItemsRequest: 'READING_PLANS_SAVED_ITEMS_REQUEST',
	savedItemsSuccess: 'READING_PLANS_SAVED_ITEMS_SUCCESS',
	savedItemsFailure: 'READING_PLANS_SAVED_ITEMS_FAILURE',

	planInfoRequest: 'READING_PLANS_PLAN_INFO_REQUEST',
	planInfoSuccess: 'READING_PLANS_PLAN_INFO_SUCCESS',
	planInfoFailure: 'READING_PLANS_PLAN_INFO_FAILURE',
	planStatsRequest: 'READING_PLANS_PLAN_STATS_REQUEST',
	planStatsSuccess: 'READING_PLANS_PLAN_STATS_SUCCESS',
	planStatsFailure: 'READING_PLANS_PLAN_STATS_FAILURE',
	planSubscribeRequest: 'READING_PLANS_SUBSCRIBE_USER_REQUEST',
	planSubscribeSuccess: 'READING_PLANS_SUBSCRIBE_USER_SUCCESS',
	planSubscribeFailure: 'READING_PLANS_SUBSCRIBE_USER_FAILURE',

	planSaveforlaterRequest: 'READING_PLANS_SAVEFORLATER_REQUEST',
	planSaveforlaterSuccess: 'READING_PLANS_SAVEFORLATER_SUCCESS',
	planSaveforlaterFailure: 'READING_PLANS_SAVEFORLATER_FAILURE',
	planRemoveSaveRequest: 'READING_PLANS_REMOVE_SAVE_REQUEST',
	planRemoveSaveSuccess: 'READING_PLANS_REMOVE_SAVE_SUCCESS',
	planRemoveSaveFailure: 'READING_PLANS_REMOVE_SAVE_FAILURE',
	configurationRequest: 'READING_PLANS_CONFIGURATION_REQUEST',
	configurationSuccess: 'READING_PLANS_CONFIGURATION_SUCCESS',
	configurationFailure: 'READING_PLANS_CONFIGURATION_FAILURE',

	calendarRequest: 'READING_PLANS_CALENDAR_REQUEST',
	calendarSuccess: 'READING_PLANS_CALENDAR_SUCCESS',
	calendarFailure: 'READING_PLANS_CALENDAR_FAILURE',

	referencesRequest: 'READING_PLANS_CALENDAR_REQUEST',
	referencesSuccess: 'READING_PLANS_CALENDAR_SUCCESS',
	referencesFailure: 'READING_PLANS_CALENDAR_FAILURE',

	itemsRequest: 'READING_PLANS_ITEMS_REQUEST',
	itemsSuccess: 'READING_PLANS_ITEMS_SUCCESS',
	itemsFailure: 'READING_PLANS_ITEMS_FAILURE',

	resetSubscriptionRequest: 'READING_PLANS_RESET_SUBSCRIPTION_REQUEST',
	resetSubscriptionSuccess: 'READING_PLANS_RESET_SUBSCRIPTION_SUCCESS',
	resetSubscriptionFailure: 'READING_PLANS_RESET_SUBSCRIPTION_FAILURE',

	completedRequest: 'READING_PLANS_COMPLETED_REQUEST',
	completedSuccess: 'READING_PLANS_COMPLETED_SUCCESS',
	completedFailure: 'READING_PLANS_COMPLETED_FAILURE',

	planSelect: 'READING_PLAN_SELECT',

	updateCompletionRequest: 'READING_PLANS_UPDATE_COMPLETION_REQUEST',
	updateCompletionSuccess: 'READING_PLANS_UPDATE_COMPLETION_SUCCESS',
	updateCompletionFailure: 'READING_PLANS_UPDATE_COMPLETION_FAILURE',

	planCompleteRequest: 'PLAN_COMPLETE_REQUEST',
	planCompleteSuccess: 'PLAN_COMPLETE_SUCCESS',
	planCompleteFailure: 'PLAN_COMPLETE_FAILURE',
}

export default function (key) {
	if (typeof key === 'string' && constants.hasOwnProperty(key)) {
		return constants[key];
	} else {
		throw new Error(`Invalid Plan Discovery Action: ${key}`)
	}
}
