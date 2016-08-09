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

			// let map = {}
			// items.forEach((item, index) => {
			// 	map[item.id] = index
			// })
			var map = buildMap(items)

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
				// var collections = Object.assign({}, action.response.collections, state.collection)
				// // loop through each collection and each item in the collection and populate the collection with the items
				// collections.items.forEach((item, index) => {
				// 	action.response.collections.forEach((responseItem) => {
				// 		if (item.id == responseItem.id) {
				// 			item.items = responseItem.items
				// 		}
				// 	})
				// })
				// return Object.assign({}, state, { collection })


				var { collections } = action.response
				var items = state.collection.items.slice(0)
				collections.forEach((collection) => {
					let newItems = collection.items
					items.forEach((item, index) => {
						newItems.forEach((newItem) => {
							if (item.id == newItem.id) {
								// item.items = newItem.items
								newerItems = [
									...item,
									...newItem
								]
							}
						})
						items[index] = Object.assign({}, items[index], collection, { items: newerItems })
					})
				})
				return Object.assign({}, state, { hasErrors: false, errors: [], items })


			} else {
				// const { collections } = action.response
				// var items = state.items.slice(0)
				// collections.forEach((collection) => {
				// 	const discoveryIndex = state.map[collection.id]
				// 	if (typeof discoveryIndex !== 'undefined') {
				// 		let newItems = collection.items
				// 		if (Array.isArray(items[discoveryIndex].items)) {
				// 			newItems = [
				// 				...items[discoveryIndex].items,
				// 				...collection.items
				// 			]
				// 		}
				// 		items[discoveryIndex] = Object.assign({}, items[discoveryIndex], collection, { items: newItems })
				// 	}
				// })
				// return Object.assign({}, state, { hasErrors: false, errors: [], items })
				//
				const { collections } = action.response
				var map = buildMap(collections)
				var items = state.items.slice(0)
				var updatedStateItems = populateItems(collections, items, map)
				return Object.assign({}, state, { hasErrors: false, errors: [], items, map })
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

function buildMap(responseItems) {

		let map = {}
		responseItems.forEach((item, index) => {
			map[item.id] = index
		})

		return map
}