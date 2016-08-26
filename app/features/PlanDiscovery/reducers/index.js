import type from '../actions/constants'
import Immutable from 'immutable'

export default function plansDiscovery(state = {}, action) {
	switch (action.type) {
		case type("discoverRequest"):
			return Immutable.fromJS(state).mergeDeep({ isFetching: true, hasErrors: false, errors: [] }).toJS()

		case type("discoverFailure"):
			return Immutable.fromJS(state).mergeDeep({ isFetching: false, hasErrors: true, errors: action.errors }).toJS()

		case type('discoverSuccess'):
			var items = action.response.items.map((item) => {
				return Immutable.fromJS(item).set('items', []).toJS()
			})
			return Immutable.fromJS(state).mergeDeep({ hasErrors: false, errors: [], items, map: buildMap(items) }).toJS()

		case type("planSaveforlaterRequest"):
		case type("planRemoveSaveRequest"):
		case type("planInfoRequest"):
		case type("planStatsRequest"):
		case type("savedItemsRequest"):
		case type("recommendationsItemsRequest"):
		case type("collectionsItemsRequest"):
			return Immutable.fromJS(state).mergeDeep({ isFetching: true, hasErrors: false, errors: [] }).toJS()

		case type("planSaveforlaterFailure"):
		case type("planRemoveSaveFailure"):
		case type("planInfoFailure"):
		case type("planStatsFailure"):
		case type("savedItemsFailure"):
		case type("recommendationsItemsFailure"):
		case type("collectionsItemsFailure"):
			return Immutable.fromJS(state).mergeDeep({ isFetching: false, hasErrors: true, errors: action.errors }).toJS()

		case type("collectionsItemsSuccess"):
			if (action.params.uiFocus) {
				var collection = Immutable.fromJS(action.response.collections[0]).mergeDeep(state.collection).toJS()
				var responseItems = collection.items.map((item) => {
					return Immutable.fromJS(item).set('items', []).toJS()
				})
				var map = buildMap(responseItems) // let's build a mapping for placing collections items inside any of these collections
				var updatedCollection = Immutable.fromJS(collection).mergeDeep({ map }).toJS()
				return Immutable.fromJS(state).mergeDeep({ collection: updatedCollection }).toJS()

			//  if a collection is inside a collection, then we need to get those items
			} else if (action.params.collectInception) {
				var { collections } = action.response
				var items = state.collection.items.slice(0)
				var updatedstateItems = populateItems(collections, items, state.collection.map)
				var updatedCollection = Immutable.fromJS(state.collection).set('items', updatedstateItems).toJS()
				return Immutable.fromJS(state).mergeDeep({ collection: updatedCollection }).toJS()

			} else {
				const { collections } = action.response
				var items = state.items.slice(0)
				var updatedStateItems = populateItems(collections, items, state.map)
				return Immutable.fromJS(state).mergeDeep({ hasErrors: false, errors: [], items: updatedStateItems }).toJS()
			}

		case type("savedItemsSuccess"):
		case type("recommendationsItemsSuccess"):

			if (action.params.readingplanInfo) {
				var reading_plans = action.response.reading_plans.map((plan) => {
					var p = Immutable.fromJS(plan).mergeDeep({ title: plan.name["default"], type: 'reading_plan' })

					// when slides are being built, if there are no images then when the slide checks for image_id, it'll be null
					if (plan.images != null) p = p.set('image_id', plan.id) // else plan.image_id doesn't exist

					return p.toJS()
				})
				return Immutable.fromJS(state).mergeDeep({ hasErrors: false, errors: [], plans: { related: { items: reading_plans, id: action.params.id } } }).toJS()

			} else if (action.params.savedplanCheck) {
				var { reading_plans } = action.response
				var saved = typeof (reading_plans.find((plan) => { return plan.id == action.params.planId })) === 'undefined' ? false : true
				return Immutable.fromJS(state).mergeDeep({ hasErrors: false, errors: [], plans: { saved: saved } }).toJS()

			} else {
				var { reading_plans } = action.response
				var items = state.items.slice(0)
				// saved items and recommended are the same except saved doesn't come back with an id, so we set it to "saved" in discoverSuccess
				var discoveryIndex = state.map[action.params.id]

				var reading_plans = action.response.reading_plans.map((plan) => {
					var p = Immutable.fromJS(plan)

					if (typeof discoveryIndex !== 'undefined') {
						p = p.mergeDeep({ title: plan.name["default"], type: 'reading_plan' })
						// when slides are being built, if there are no images then when the slide checks for image_id, it'll be null
						if (plan.images != null)  p = p.set('image_id', plan.id) // else plan.image_id doesn't exist
					}

					return p.toJS()
				})
				items[discoveryIndex] = Immutable.fromJS(items[discoveryIndex]).set('items', reading_plans).toJS()
				return Immutable.fromJS(state).mergeDeep({ hasErrors: false, errors: [], items }).toJS()
			}

		case type("planSaveforlaterSuccess"):
		case type("planRemoveSaveSuccess"):
			return Immutable.fromJS(state).mergeDeep({ hasErrors: false, errors: [], plans: { saved: !state.plans.saved } }).toJS()

		case type("planInfoSuccess"):
			return Immutable.fromJS(state).mergeDeep({ hasErrors: false, errors: [], plans: action.response }).toJS()

		case type("planStatsSuccess"):
			return Immutable.fromJS(state).mergeDeep({ hasErrors: false, errors: [], plans: { stats: action.response } }).toJS()

		case type('configurationRequest'):
		case type('configurationFailure'):
			return state

		case type('configurationSuccess'):
			return Immutable.fromJS(state).mergeDeep({ configuration: action.response }).toJS()

		case type('collectionRequest'):
		case type('collectionFailure'):
			return state

		case type('collectionSuccess'):
			return Immutable.fromJS(state).mergeDeep({ collection: action.response }).toJS()

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
			if (item.type === 'saved') {
				map["saved"] = index
			} else {
				map[item.id] = index
			}
		})
		return map
}