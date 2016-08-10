import type from '../actions/constants'

export default function plansDiscovery(state = {}, action) {
	switch (action.type) {
		case type("discoverRequest"):
			return Object.assign({}, state, { isFetching: true, hasErrors: false, errors: [] })

		case type("discoverFailure"):
			return Object.assign({}, state, { isFetching: false, hasErrors: true, errors: action.errors })

		case type('discoverSuccess'):
			var items = action.response.items.map((item) => {
				return Object.assign({}, item, { items: [] })
			})
			var map = buildMap(items)

			return Object.assign({}, state, { hasErrors: false, errors: [], items, map })

		case type("collectionsItemsRequest"):
			return Object.assign({}, state, { isFetching: true, hasErrors: false, errors: [] })

		case type("collectionsItemsFailure"):
			return Object.assign({}, state, { isFetching: false, hasErrors: true, errors: action.errors })

		case type("collectionsItemsSuccess"):
			if (action.params.uiFocus) {
				var collection = Object.assign({}, action.response.collections[0], state.collection)
				var responseItems = collection.items.map((item) => {
					return Object.assign({}, item, { items: [] })
				})
				// let's build a mapping for placing collections items inside any of these collections
				var map = buildMap(responseItems)
				var updatedCollection = Object.assign({}, collection, { map: map })

				return Object.assign({}, state, { collection: updatedCollection })
			//  if a collection is inside a collection, then we need to get those items
			} else if (action.params.collectInception) {
				var { collections } = action.response
				var items = state.collection.items.slice(0)
				var updatedstateItems = populateItems(collections, items, state.collection.map)
				var updatedCollection = Object.assign({}, state.collection, {items: updatedstateItems })

				return Object.assign({}, state, { collection: updatedCollection })
			} else {
				const { collections } = action.response
				var items = state.items.slice(0)
				var updatedStateItems = populateItems(collections, items, state.map)

				return Object.assign({}, state, { hasErrors: false, errors: [], items })
			}

		case type('configurationRequest'):
		case type('configurationFailure'):
			return state

		case type('configurationSuccess'):
			return Object.assign({}, state, { configuration: action.response })

		case type('collectionRequest'):
		case type('collectionFailure'):
			return state

		case type('collectionSuccess'):
			return Object.assign({}, state, { collection: action.response })

		default:
			return state
	}
}


/**
 * @brief: 		[ goes through each collection and populates the items for that collection
 * 							based on the map of where each collection is in the state ]
 *
 * @param: 		{object}  collections  [ all the collections to loop through and populate items for ]
 * @param:  	{array}  	stateItems   [ the current items in the state (could be state.items for planDiscovery, or state.collection.items for
 * 																		 populating items for collections) ]
 * @param: 	  {object}  map          [ map for determining what collection is where in the list ]
 */
function populateItems(collections, stateItems, map) {

	collections.forEach((collection) => {
		const discoveryIndex = map[collection.id]
		if (typeof discoveryIndex !== 'undefined') {
			let newItems = collection.items
			if (Array.isArray(stateItems[discoveryIndex].items)) {
				newItems = [
					...stateItems[discoveryIndex].items,
					...collection.items
				]
			}
			stateItems[discoveryIndex] = Object.assign({}, stateItems[discoveryIndex], collection, { items: newItems })
		}
	})
	return stateItems
}


/**
 * @brief: 		[ builds a map that relates the collection id to its index
 * 							used to populateItems() ]
 *
 * @param     {array}		responseItems  [ items received from response (new collections items) ]
 */
function buildMap(responseItems) {

		let map = {}
		responseItems.forEach((item, index) => {
			map[item.id] = index
		})

		return map
}