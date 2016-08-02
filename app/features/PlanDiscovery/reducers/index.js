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
				if (item.id == null) {
					map["saved"] = index
				} else {
					map[item.id] = index
				}
			})

			return Object.assign({}, state, { hasErrors: false, errors: [], items, map })

		case type("savedItemsRequest"):
		case type("recommendationsItemsRequest"):
		case type("collectionsItemsRequest"):
			return Object.assign({}, state, { isFetching: true, hasErrors: false, errors: [] })

		case type("savedItemsFailure"):
		case type("recommendationsItemsFailure"):
		case type("collectionsItemsFailure"):
			return Object.assign({}, state, { isFetching: false, hasErrors: true, errors: action.errors })


		case type("collectionsItemsSuccess"):
			if (action.params.uiFocus) {
				const collection = Object.assign({}, action.response.collections[0], state.collection)
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



		case type("recommendationsItemsSuccess"):
			const { reading_plans } = action.response
			var items = state.items.slice(0)
			const discoveryIndex = state.map[action.params.id]
			items[discoveryIndex] = [ reading_plans ]
			// reading_plans.forEach((plan) => {
			// 	if (typeof discoveryIndex !== 'undefined') {
			// 		let newItems = plan.items
			// 		if (Array.isArray(items[discoveryIndex].items)) {
			// 			newItems = [
			// 				...items[discoveryIndex].items,
			// 				...plan.items
			// 			]
			// 		}
			// 		items[discoveryIndex] = Object.assign({}, items[discoveryIndex], plan, { items: newItems })
			// 	}
			// })
			return Object.assign({}, state, { hasErrors: false, errors: [], items })


		case type("savedItemsSuccess"):
			const { queued_items } = action.response
			var items = state.items.slice(0)
			reading_plans.forEach((plan) => {
				const discoveryIndex = state.map[plan.id]
				if (typeof discoveryIndex !== 'undefined') {
					let newItems = plan
					if (Array.isArray(items[discoveryIndex].items)) {
						newItems = [
							...items[discoveryIndex].items,
							...plan
						]
					}
					items[discoveryIndex] = Object.assign({}, items[discoveryIndex], plan, { items: newItems })
				}
			})
			return Object.assign({}, state, { hasErrors: false, errors: [], items })

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
