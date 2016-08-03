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
					var discoveryIndex = state.map[collection.id]
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


		case type("savedItemsSuccess"):
		case type("recommendationsItemsSuccess"):
			var { reading_plans } = action.response
			var items = state.items.slice(0)
			// saved items and recommended are the same except saved doesn't come back with an id, so we set it to "saved" in discoverSuccess
			var discoveryIndex = (action.type != type("savedItemsSuccess")) ? state.map[action.params.id] : state.map["saved"]
			items[discoveryIndex].items = reading_plans
			reading_plans.forEach((plan) => {
				if (typeof discoveryIndex !== 'undefined') {
					// map some stuff for the standard carousel
					plan.title = plan.name["default"]
					// when slides are being built, if there are no images then when the slide checks for image_id, it'll be null
					if (plan.images != null) plan.image_id = plan.id // else plan.image_id doesn't exist
					plan.type = "reading_plan"
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
