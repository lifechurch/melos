import React, { Component, PropTypes } from 'react'
import LocalStore from '../../../../lib/localStore'
import PlayButton from './PlayButton'
import PauseButton from './PauseButton'
import SeekButton from './SeekButton'
import AudioTrack from './AudioTrack'
import ButtonBar from '../../../../components/ButtonBar'

const POST_MESSAGE_EVENTS = {
	STANDALONE_TIME_UPDATE: 'STANDALONE_TIME_UPDATE',
	STANDALONE_SPEED_CHANGE: 'STANDALONE_SPEED_CHANGE',
	STANDALONE_YIELD_TO_ORIGIN: 'STANDALONE_YIELD_TO_ORIGIN'
}

const IS_CLIENT = (typeof window !== 'undefined')
const IS_STANDALONE = (IS_CLIENT && typeof window.opener !== 'undefined' && window.opener !== null && typeof window.opener.postMessage === 'function')

class AudioPlayer extends Component {
	constructor(props) {
		super(props)

		this.POST_MESSAGE_URL_ORIGIN = props.hosts.nodeHost || "http://localhost:3000"
		this.POST_MESSAGE_URL_STANDALONE = props.hosts.railsHost || "http://localhost:8001"
		this.ALLOWED_ORIGINS = [ this.POST_MESSAGE_URL_STANDALONE, this.POST_MESSAGE_URL_ORIGIN ]

		this.playbackSpeeds = [
			{ value: 0.75, label: "0.75x" },
			{ value: 1, label: "1x" },
			{ value: 1.5, label: "1.5x" },
			{ value: 2, label: "2x" }
		]

		if (IS_STANDALONE) {
			this.state = Object.assign({}, LocalStore.get("standaloneAudioPlayerState"), {
				initialized: false,
				hasStandalone: false,
				standaloneWindow: null
			})
		} else {
			this.state = {
				standaloneWindow: null,
				initialized: false,
				playing: false,
				buffering: false,
				paused: false,
				hasError: false,
				currentTime: 0,
				duration: 0,
				percentComplete: 0,
				playbackRate: LocalStore.getIn("audio.player.playbackRate") || 1,
				hasStandalone: props.hasStandalone || false
			}
		}

		this.handleSpeedChangeRequest = ::this.handleSpeedChangeRequest
		this.handlePlayerLoaded = ::this.handlePlayerLoaded
		this.handlePlayerError = ::this.handlePlayerError
		this.handlePlayerPlayRequest = ::this.handlePlayerPlayRequest
		this.handlePlayerPauseRequest = ::this.handlePlayerPauseRequest
		this.handlePlayerPlaying = ::this.handlePlayerPlaying
		this.handlePlayerPause = ::this.handlePlayerPause
		this.handlePlayerSeekRequest = ::this.handlePlayerSeekRequest
		this.handlePlayerTimeUpdate = ::this.handlePlayerTimeUpdate
		this.handlePlayerDurationChange = ::this.handlePlayerDurationChange
		this.handlePlayerSeekToRequest = ::this.handlePlayerSeekToRequest
		this.listenForPostMessages = ::this.listenForPostMessages
		this.handlePostMessage = ::this.handlePostMessage
		this.handleYieldToStandalone = ::this.handleYieldToStandalone
		this.handleResumeFromStandalone = ::this.handleResumeFromStandalone
		this.handleYieldToOrigin = ::this.handleYieldToOrigin
	}

	handleSpeedChangeRequest(s) {
		if (typeof s === 'object' && typeof s.value !== 'undefined') {
			this.player.playbackRate = s.value
			this.setState({playbackRate: s.value})
			LocalStore.setIn("audio.player.playbackRate", s.value)
			if (IS_STANDALONE) {
				window.opener.postMessage({ name: POST_MESSAGE_EVENTS.STANDALONE_SPEED_CHANGE, value: s }, this.POST_MESSAGE_URL_STANDALONE)
			}
		}
	}

	handlePlayerLoaded(player) {
		const { currentTime, playing } = this.state

		this.player = player
		this.player.onerror = this.handlePlayerError
		this.player.onplay = this.handlePlayerPlaying
		this.player.onpause = this.handlePlayerPause
		this.player.playbackRate = this.state.playbackRate
		this.player.ontimeupdate = this.handlePlayerTimeUpdate
		this.player.ondurationchange = this.handlePlayerDurationChange
		this.player.currentTime = currentTime

		if (playing) {
			this.handlePlayerPlayRequest()
		}

		this.setState({ initialized: true })
	}

	handlePlayerError(e) {
		this.setState({ hasError: true })
	}

	handlePlayerPlayRequest() {
		this.player.play()
	}

	handlePlayerPauseRequest() {
		this.player.pause()
	}

	handlePlayerPlaying() {
		this.setState({ playing: true, paused: false, buffering: false })
	}

	handlePlayerPause() {
		this.setState({ playing: false, paused: true })
	}

	handlePlayerSeekRequest(increment) {
		this.player.currentTime = this.player.currentTime + increment
	}

	handlePlayerTimeUpdate() {
		const { onTimeChange } = this.props
		let percentComplete = 0
		if (this.player.duration) {
			percentComplete = (this.player.currentTime / this.player.duration)*100
		}

		if (typeof onTimeChange === 'function') {
			onTimeChange({
				currentTime: this.player.currentTime,
				percentComplete: percentComplete
			})
		}

		if (IS_STANDALONE) {
			window.opener.postMessage({ name: POST_MESSAGE_EVENTS.STANDALONE_TIME_UPDATE, value: this.player.currentTime }, this.POST_MESSAGE_URL_STANDALONE)
		}

		this.setState({
			currentTime: Math.floor(this.player.currentTime),
			percentComplete: percentComplete
		})
	}

	handlePlayerDurationChange() {
		let percentComplete = 0
		if (this.player.duration) {
			percentComplete = (this.player.currentTime / this.player.duration)*100
		}
		this.setState({
			duration: Math.floor(this.player.duration),
			percentComplete: percentComplete
		})
	}

	handlePlayerSeekToRequest(s) {
		if (this.player.duration > s) {
			this.player.currentTime = s
		}
	}

	listenForPostMessages() {
		if (IS_CLIENT) {
			window.addEventListener("message", this.handlePostMessage, false)
		}
	}

	handlePostMessage(e) {
		if (this.ALLOWED_ORIGINS.indexOf(e.origin) !== -1 && typeof e !== 'undefined' && typeof e.data === 'object') {
			if (IS_STANDALONE) {
				switch(e.data.name) {
					case POST_MESSAGE_EVENTS.STANDALONE_YIELD_TO_ORIGIN:
						return this.handleYieldToOrigin()

					default:
						return
				}
			} else {
				switch(e.data.name) {
					case POST_MESSAGE_EVENTS.STANDALONE_TIME_UPDATE:
						if (typeof e.data.value === 'number' && typeof this.player !== 'undefined') {
							this.handlePlayerSeekToRequest(e.data.value)
						}
						return

					case POST_MESSAGE_EVENTS.STANDALONE_SPEED_CHANGE:
						if (typeof e.data.value === 'object' && typeof this.player !== 'undefined') {
							this.handleSpeedChangeRequest(e.data.value)
						}
						return

					default:
						return
				}
			}
		}
	}

	handleYieldToStandalone() {
		const { audio } = this.props
		LocalStore.set("standaloneAudioPlayerState", Object.assign({}, this.state, { standaloneWindow: null }))
		LocalStore.set("standaloneAudioPlayerAudio", audio)
		this.handlePlayerPauseRequest()
		let standaloneWindow = window.open('http://localhost:3000/en-US/bible-audio-player', '_blank')
		this.setState({ hasStandalone: true, standaloneWindow: standaloneWindow })
	}

	handleYieldToOrigin() {
		if (IS_STANDALONE) {
			window.close()
		}
	}

	handleResumeFromStandalone() {
		const { onResumeFromStandalone } = this.props
		const { standaloneWindow } = this.state

		if (typeof standaloneWindow !== 'undefined' && standaloneWindow !== null) {
			standaloneWindow.postMessage({ name: POST_MESSAGE_EVENTS.STANDALONE_YIELD_TO_ORIGIN }, this.POST_MESSAGE_URL_ORIGIN)
		}

		if (typeof onResumeFromStandalone === 'function') {
			onResumeFromStandalone()
		}

		this.setState({ hasStandalone: false, standaloneWindow: null })
		this.handlePlayerPlayRequest()
	}

	componentDidMount() {
		this.listenForPostMessages()
	}

	componentWillReceiveProps(nextProps) {
		const { hasStandalone } = this.state
		if (nextProps.hasStandalone === true && !hasStandalone) {
			this.handleYieldToStandalone()
		}
	}

	render() {
		const { audio } = this.props
		const { initialized, playing, buffering, paused, hasError, playbackRate, currentTime, duration, percentComplete, hasStandalone } = this.state

		if (typeof audio === 'undefined' || typeof audio.download_urls !== 'object') {
			return null
		}	else {

			const audioSources = Object.keys(audio.download_urls).map((fileType) => {
				return (<source key={fileType} src={audio.download_urls[fileType]} />)
			})

			const button = playing ? (<PauseButton onClick={this.handlePlayerPauseRequest} />) : (<PlayButton onClick={this.handlePlayerPlayRequest} />)

			const overlay = hasStandalone ? (
				<div className='audio-player-overlay'>
					<p className='caption'>Bible audio is playing in another window.</p>
					<a className='solid-button green padded' onClick={this.handleResumeFromStandalone}>Resume</a>
				</div>
			) : null

			return (
				<div className='audio-player'>
					<h3>{audio.title}</h3>
					<p>{audio.copyright.text}</p>
					<div className="audio-buttons">
						<SeekButton increment={-30} height={29} width={25} color="#89847D" onClick={this.handlePlayerSeekRequest} />
						{button}
						<SeekButton increment={30} height={29} width={25} color="#89847D" onClick={this.handlePlayerSeekRequest} />
					</div>
					<AudioTrack duration={duration} currentTime={currentTime} percentComplete={percentComplete} onSeek={this.handlePlayerSeekToRequest} />
					<audio
						preload="none"
						playbackRate={playbackRate}
						ref={this.handlePlayerLoaded} >
						{audioSources}
					</audio>
					<ButtonBar initialValue={playbackRate} items={this.playbackSpeeds} onClick={this.handleSpeedChangeRequest} />
					{overlay}
				</div>
			)
		}
	}
}

AudioPlayer.propTypes = {
	audio: React.PropTypes.object.isRequired,
	onTimeChange: React.PropTypes.func,
	hasStandalone: React.PropTypes.bool,
	onResumeFromStandalone: React.PropTypes.func,
	hosts: React.PropTypes.object
}

AudioPlayer.defaultProps = {
	audio: {},
	hasStandalone: false,
	hosts: {}
}

export default AudioPlayer