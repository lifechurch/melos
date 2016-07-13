import type from '../actions/constants'

export default function plansDiscovery(state = {}, action) {
	switch (action.type) {
		case type("discoverRequest"):
			return Object.assign({}, state, { isFetching: true, hasErrors: false, errors: [] })

		case type("discoverFailure"):
			return Object.assign({}, state, { isFetching: false, hasErrors: true, errors: action.errors })

		case type('discoverSuccess'):
			const { items } = action.response
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
			const { collections } = action.response
			var items = state.items.slice(0)
			collections.forEach((collection) => {
				const discoveryIndex = state.map[collection.id]
				if (typeof discoveryIndex !== 'undefined') {
					items[discoveryIndex] = Object.assign({}, items[discoveryIndex], collection)
				}
			})
			return Object.assign({}, state, { hasErrors: false, errors: [], items })

		default:
			return state
	}
}
