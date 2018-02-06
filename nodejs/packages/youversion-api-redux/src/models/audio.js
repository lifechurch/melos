import { createSelector } from 'reselect'
import Immutable from 'immutable'
import { getAudioChapter } from '../endpoints/audio/reducer'

const getAudioModel = createSelector(
	// get each piece of state needed to build out the full model
	[ getAudioChapter ],
	(chapter) => {
		const audioModel = { }

		if (chapter) {
			audioModel.chapter = chapter
		}

		// utility functions on model
		audioModel.pullRef = (usfm, id = null) => {
			if (!Immutable.fromJS(audioModel).hasIn(['chapter', usfm])) {
				return null
			}

			const refsObj = Immutable
				.fromJS(audioModel.chapter)
				.get(usfm)
				.toJS()

			return refsObj[id || Object.keys(refsObj)[0]]
		}

		return audioModel
	}
)

export default getAudioModel
