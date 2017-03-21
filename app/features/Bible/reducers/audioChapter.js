import Immutable from 'immutable'
import type from '../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('audiobibleChapterRequest'):
			return { loading: true, readyToPlay: false }

		// if we're making a full chapter call for reading plan refs, let's pull the
		// audio out from the response and put it in audioChapter next to all the other refs
		// where we made the audioBible call
		case type('bibleChapterSuccess'):
			return (function bibleChapterPullAudioSuccess() {
				const { response: { audio }, params: { reference } } = action
				if (audio && typeof audio !== 'undefined' && typeof audio[0] !== 'undefined' && 'id' in audio[0]) {
					return Immutable.fromJS(state).mergeDeep({ [reference]: audio[0] }).toJS()
				}
				return state
			}())
		case type('audiobibleChapterSuccess'):
			return (function audiobibleChapterSuccess() {
				const { response: { chapter }, params: { reference } } = action
				if (typeof chapter !== 'undefined' && typeof chapter[0] !== 'undefined') {
					return Immutable.fromJS(state).mergeDeep({ [reference]: chapter[0] }).toJS()
				} else {
					return { loading: false }
				}
			}())

		default:
			return state
	}
}
