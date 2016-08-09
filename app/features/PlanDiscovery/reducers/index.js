import type from '../actions/constants'

export default function plansDiscovery(state = {}, action) {
	switch (action.type) {
		case type("discoverRequest"):
			return Object.assign({}, state, { isFetching: true, hasErrors: false, errors: [] })

		case type("discoverFailure"):
			return Object.assign({}, state, { isFetching: false, hasErrors: true, errors: action.errors })

		case type('discoverSuccess'):
			const items  = action.response.items.map((item) => {
				return Object.assign({}, item, { items: [] })
			})

			let map = {}
			items.forEach((item, index) => {
				map[item.id] = index
			})

			return Object.assign({}, state, { hasErrors: false, errors: [], items, map })

		case type("collectionsItemsRequest"):
			return Object.assign({}, state, { isFetching: true, hasErrors: false, errors: [] })

		case type("collectionsItemsFailure"):
			return Object.assign({}, state, { isFetching: false, hasErrors: true, errors: action.errors })

		case type("collectionsItemsSuccess"):
			if (action.params.uiFocus) {
				var collection = Object.assign({}, action.response.collections[0], state.collection)
				return Object.assign({}, state, { collection })
			//  if a collection is inside a collection, then we need to get those items
			} else if (action.params.collectInception) {
				var collection = Object.assign({}, action.response.collections[0], state.collection)
				collection.items.forEach((item) => {
					// populate the items for the collection that made the items call
					if (item.id == action.response.collections[0].id) {
						item.items = action.response.collections[0].items
					}
				})
				return Object.assign({}, state, { collection })
			} else {
				const { collections } = action.response
				var items = state.items.slice(0)
				collections.forEach((collection) => {
					const discoveryIndex = state.map[collection.id]
					if (typeof discoveryIndex !== 'undefined') {
						let newItems = collection.items
						if (Array.isArray(items[discoveryIndex].items)) {
							newItems = [
								...items[discoveryIndex].items,
								...collection.items
							]
						}
						items[discoveryIndex] = Object.assign({}, items[discoveryIndex], collection, { items: newItems })
					}
				})
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
