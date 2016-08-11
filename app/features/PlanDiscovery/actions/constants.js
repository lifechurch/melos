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
	configurationRequest: 'READING_PLANS_CONFIGURATION_REQUEST',
	configurationSuccess: 'READING_PLANS_CONFIGURATION_SUCCESS',
	configurationFailure: 'READING_PLANS_CONFIGURATION_FAILURE'
}

export default function (key) {
	if (typeof key === 'string' && constants.hasOwnProperty(key)) {
		return constants[key];
	} else {
		throw new Error('Invalid Plan Discovery Action: ' + key)
	}
}
