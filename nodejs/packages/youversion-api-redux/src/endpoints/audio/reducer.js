import Immutable from 'immutable'
import reducerGenerator from '../../generators/reducer'

export const getAudioChapter = (state) => {
	return state.api.audio
		&& state.api.audio.chapter
		? state.api.audio.chapter
		: null
}

const methodDefinitions = {
	chapter: {
		success: ({ state, params, response }) => {
			return Immutable
				.fromJS(state)
				.mergeDeepIn(['chapter'], {
					[params.reference]: { [params.version_id]: response.chapter[0] }
				})
				.toJS()
		}
	}
}

const audio = reducerGenerator('audio-bible', methodDefinitions)

export default audio
