import React, { Component } from 'react'
import AudioPlayer from '../features/Bible/components/audio/AudioPlayer'
import LocalStore from '../lib/localStore'

class BibleAudioView extends Component {

	render() {
		const audio = LocalStore.get("standaloneAudioPlayerAudio")
		return (
			<div className="standalone-audio-player">
				<AudioPlayer audio={audio} />
			</div>
		)
	}
}

export default BibleAudioView
