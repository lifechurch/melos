import Immutable from 'immutable'
import reducerGenerator from '../../generators/reducer'


export const getImages = (state) => {
	const data = state.api.images
		&& state.api.images.items
		&& state.api.images.items
		? state.api.images.items
		: null
	return data && { ...data.response, loading: data.loading }
}

const methodDefinitions = {
	items: {
		success: ({ state, response }) => {
			if (response && response.images) {
				if (state.items && state.items.response && state.items.response.all) {
					const mergedImages = state.items.response.all.concat(response.images)
					return Immutable
						.fromJS(state)
						.mergeIn(['items', 'response'], { all: mergedImages })
						.mergeIn(['items'], { loading: false })
						.setIn(['items', 'response', 'next_page'], response.next_page)
						.toJS()
				} else {
					return Immutable
						.fromJS(state)
						.mergeIn(['items', 'response'], { all: response.images })
						.mergeIn(['items'], { loading: false })
						.setIn(['items', 'response', 'next_page'], response.next_page)
						.toJS()
				}
			}
			return state
		},
		failure: ({ params, state }) => {
			// keep track of usfms we know we don't have images for
			const usfm = params.usfm
			const prev = (state.items.response && state.items.response.no_images) || []
			const mergedUsfms = prev.includes(usfm)
				? prev
				: prev.concat(params.usfm)
			return Immutable
				.fromJS(state)
				.mergeIn(['items', 'response'], { no_images: mergedUsfms })
				.mergeIn(['items'], { loading: false })
				.toJS()
		}
	},
}

const imagesReducers = reducerGenerator('images', methodDefinitions)

export default imagesReducers
