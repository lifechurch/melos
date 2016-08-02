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
