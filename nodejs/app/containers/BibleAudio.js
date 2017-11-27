import React from 'react'
import LocalStore from '@youversion/utils/lib/localStore'
import AudioPlayer from '../features/Bible/components/audio/AudioPlayer'

function BibleAudioView() {
	const audio = LocalStore.get('standaloneAudioPlayerAudio')
	return (
		<div className="standalone-audio-player">
			<AudioPlayer audio={audio} />
		</div>
	)
}

export default BibleAudioView
