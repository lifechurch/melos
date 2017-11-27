import arrayToObject from '@youversion/utils/lib/arrayToObject'
import type from '../actions/constants'
import { fromApiFormat } from '../transformers/location'

export default function locations(state = {}, action) {

	switch (action.type) {

		case type('deleteRequest'):
			const { items } = state
			delete items[action.locationId]
			return {
				isFetching: false,
				items
			}

		case type('itemsRequest'):
			return Object.assign({}, state, {
				isFetching: true
			})

		case type('itemsSuccess'):
			let { locations } = action.response
			if (Array.isArray(locations) && locations.length > 0) {

				locations = locations.map((location) => {
					return {
						...location,
						times: [],
						isSelected: false
					}
				})

				return {
					isFetching: false,
					items: arrayToObject(locations, 'id')
				}

			} else {
				return Object.assign({}, state, {
					isFetching: false
				})
			}

		default:
			return state

	}
}
