const constants = {
	discoverRequest: 'READING_PLANS_DISCOVER_REQUEST',
	discoverSuccess: 'READING_PLANS_DISCOVER_SUCCESS',
	discoverFailure: 'READING_PLANS_DISCOVER_FAILURE',
	collectionsItemsRequest: 'READING_PLANS_COLLECTIONS_ITEMS_REQUEST',
	collectionsItemsSuccess: 'READING_PLANS_COLLECTIONS_ITEMS_SUCCESS',
	collectionsItemsFailure: 'READING_PLANS_COLLECTIONS_ITEMS_FAILURE',
}

export default function (key) {
	if (typeof key === 'string' && constants.hasOwnProperty(key)) {
		return constants[key];
	} else {
		throw new Error('Invalid Plan Discovery Action: ' + key)
	}
}
