import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LocalStore from '@youversion/utils/lib/localStore'
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
		const { hosts, playing, startTime, stopTime, hasStandalone } = props
		this.POST_MESSAGE_URL_ORIGIN = hosts && 'nodeHost' in hosts ?
																		hosts.nodeHost :
																		'http://localhost:3000'
		this.POST_MESSAGE_URL_STANDALONE = hosts && 'nodeHost' in hosts ?
																				hosts.nodeHost :
																				'http://localhost:8001'
		this.ALLOWED_ORIGINS = [ this.POST_MESSAGE_URL_STANDALONE, this.POST_MESSAGE_URL_ORIGIN ]

		this.playbackSpeeds = [
			{ value: 0.75, label: '0.75x' },
			{ value: 1, label: '1x' },
			{ value: 1.5, label: '1.5x' },
			{ value: 2, label: '2x' }
		]

		const playbackRate = LocalStore.getIn('audio.player.playbackRate') || 1

		if (IS_STANDALONE) {
			this.state = Object.assign({}, LocalStore.get('standaloneAudioPlayerState'), {
				initialized: false,
				hasStandalone: false,
				standaloneWindow: null
			})
		} else {
			this.state = {
				standaloneWindow: null,
				initialized: false,
				playing: playing || false,
				buffering: false,
				paused: false,
				hasError: false,
				currentTime: startTime || 0,
				stopTime: stopTime || null,
				duration: 0,
				percentComplete: 0,
				playbackRate,
				hasStandalone: hasStandalone || false
			}
		}

		this.handleSpeedChangeRequest = ::this.handleSpeedChangeRequest
		this.handlePlayerLoaded = ::this.handlePlayerLoaded
		this.handlePlayerError = ::this.handlePlayerError
		this.handlePlayerPlayRequest = ::this.handlePlayerPlayRequest
		this.handlePlayerPauseRequest = ::this.handlePlayerPauseRequest
		this.handlePlayerPlaying = ::this.handlePlayerPlaying
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

	componentDidMount() {
		this.listenForPostMessages()
	}

	componentWillReceiveProps(nextProps) {
		const { hasStandalone } = this.state
		if (nextProps.hasStandalone === true && !hasStandalone) {
			this.handleYieldToStandalone()
		}
	}

	componentDidUpdate(prevProps) {
		const { audio, startTime, stopTime, playing: playingProp } = this.props
		const { playing } = this.state
		const prevaudioRef = 	prevProps.audio && 'download_urls' in prevProps.audio ?
													prevProps.audio.download_urls[Object.keys(prevProps.audio.download_urls)[0]]
													: null
		const audioRef = 	audio && 'download_urls' in audio ?
											audio.download_urls[Object.keys(audio.download_urls)[0]]
											: null

		if (audioRef !== prevaudioRef && audioRef !== null && typeof audioRef !== 'undefined') {
			this.handlePlayerSrcLoad(audioRef, playing || playingProp)
		}
		if (startTime !== prevProps.startTime) {
			this.player.currentTime = startTime
			this.setState({
				currentTime: startTime,
				stopTime,
			})
		}
	}

	componentWillUnmount() {
		if (this.player) {
			this.player.pause()

			this.player.oncanplaythrough = null
			this.player.onerror = null
			this.player.onplay = null
			this.player.onpause = null
			this.player.ontimeupdate = null
			this.player.ondurationchange = null

			const srcs = this.player.querySelectorAll('source')
			for (let i = 0; i < srcs.length; i++) {
				srcs[i].src = null
			}

			this.player.load()
			this.player = null
		}
	}

	handlePlayerSrcLoad(src, playAfterLoad) {
		this.player.querySelector('source').src = src
		this.player.pause()
		this.player.currentTime = 0
		this.player.load()
		if (playAfterLoad) {
			this.player.oncanplaythrough = this.player.play()
		}
	}

	handleSpeedChangeRequest(s) {
		if (typeof s === 'object' && typeof s.value !== 'undefined') {
			this.player.playbackRate = s.value
			this.setState({ playbackRate: s.value })
			LocalStore.setIn('audio.player.playbackRate', s.value)
			if (IS_STANDALONE) {
				window.opener.postMessage({ name: POST_MESSAGE_EVENTS.STANDALONE_SPEED_CHANGE, value: s }, this.POST_MESSAGE_URL_STANDALONE)
			}
		}
	}

	handlePlayerLoaded(player) {
		if (typeof player !== 'undefined' && player !== null) {
			const { currentTime, playing } = this.state
			this.player = player
			this.player.onerror = this.handlePlayerError
			this.player.onplay = this.handlePlayerPlaying
			this.player.onpause = this.handlePlayerPause
			this.player.playbackRate = this.state.playbackRate
			this.player.ontimeupdate = this.handlePlayerTimeUpdate
			this.player.ondurationchange = this.handlePlayerDurationChange
			this.player.currentTime = currentTime || 0

			if (playing) {
				this.handlePlayerPlayRequest()
			}

			this.setState({ initialized: true })
		}
	}

	handlePlayerError() {
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

	handleAudioCompleted() {
		const { onAudioComplete } = this.props
		if (typeof onAudioComplete === 'function') {
			onAudioComplete()
		}
	}

	handlePlayerTimeUpdate() {
		const { onTimeChange } = this.props
		const { stopTime } = this.state
		let percentComplete = 0

		if (this.player) {
			this.player.playbackRate = this.state.playbackRate
		}

		// if we have a stop time, let's stop when we reach it!
		if (stopTime && this.player && this.player.currentTime >= stopTime) {
			this.handlePlayerPauseRequest()
			this.handleAudioCompleted()
		}

		if (this.player && this.player.duration) {
			percentComplete = (this.player.currentTime / this.player.duration) * 100

			if (this.player.currentTime >= this.player.duration) {
				this.handleAudioCompleted()
			}
		}

		if (this.player && typeof onTimeChange === 'function') {
			onTimeChange({
				currentTime: this.player.currentTime,
				percentComplete
			})
		}

		if (this.player && IS_STANDALONE) {
			window.opener.postMessage({ name: POST_MESSAGE_EVENTS.STANDALONE_TIME_UPDATE, value: this.player.currentTime }, this.POST_MESSAGE_URL_STANDALONE)
		}

		if (this.player) {
			this.setState({
				currentTime: Math.floor(this.player.currentTime),
				percentComplete
			})
		}

	}

	handlePlayerDurationChange() {
		let percentComplete = 0
		if (this.player && this.player.duration) {
			percentComplete = (this.player.currentTime / this.player.duration) * 100
		}
		this.setState({
			duration: Math.floor(this.player.duration),
			percentComplete
		})
	}

	handlePlayerSeekToRequest(s) {
		if (this.player && this.player.duration > s) {
			this.player.currentTime = s
		}
	}

	listenForPostMessages() {
		if (IS_CLIENT) {
			window.addEventListener('message', this.handlePostMessage, false)
		}
	}

	handlePostMessage(e) {
		if (this.ALLOWED_ORIGINS.indexOf(e.origin) !== -1 && typeof e !== 'undefined' && typeof e.data === 'object') {
			if (IS_STANDALONE) {
				switch (e.data.name) {
					case POST_MESSAGE_EVENTS.STANDALONE_YIELD_TO_ORIGIN:
						return this.handleYieldToOrigin()

					default:
						return null
				}
			} else {
				switch (e.data.name) {
					case POST_MESSAGE_EVENTS.STANDALONE_TIME_UPDATE:
						if (typeof e.data.value === 'number' && typeof this.player !== 'undefined') {
							this.handlePlayerSeekToRequest(e.data.value)
						}
						return null

					case POST_MESSAGE_EVENTS.STANDALONE_SPEED_CHANGE:
						if (typeof e.data.value === 'object' && typeof this.player !== 'undefined') {
							this.handleSpeedChangeRequest(e.data.value)
						}
						return null

					default:
						return null
				}
			}
		}
		return null
	}

	handleYieldToStandalone() {
		const { audio, hosts } = this.props
		LocalStore.set('standaloneAudioPlayerState', Object.assign({}, this.state, { standaloneWindow: null }))
		LocalStore.set('standaloneAudioPlayerAudio', audio)
		this.handlePlayerPauseRequest()
		const standaloneWindow = window.open(`${hosts.nodeHost}/en-US/bible-audio-player`, '_blank')
		this.setState({ hasStandalone: true, standaloneWindow })
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


	render() {
		const { audio } = this.props
		const { playing } = this.state
		const { playbackRate, currentTime, duration, percentComplete, hasStandalone } = this.state

		if (audio === null || typeof audio === 'undefined' || typeof audio.download_urls !== 'object') {
			return null
		}	else {
			const audioSources = Object.keys(audio.download_urls).map((fileType) => {
				if (audio.download_urls[fileType] !== null && typeof audio.download_urls[fileType] !== 'undefined') {
					return (<source key={fileType} src={audio.download_urls[fileType]} />)
				}
				return null
			})

			const button = (playing) ? (<PauseButton onClick={this.handlePlayerPauseRequest} />) : (<PlayButton onClick={this.handlePlayerPlayRequest} />)

			const overlay = hasStandalone ? (
				<div className='audio-player-overlay'>
					<p className='caption'>Bible audio is playing in another window.</p>
					<a className='solid-button green padded' tabIndex={0} onClick={this.handleResumeFromStandalone}>Resume</a>
				</div>
			) : null

			return (
				<div className='audio-player'>
					<h3>{audio.title ? audio.title : null}</h3>
					<p>{audio.copyright ? audio.copyright.text : null}</p>
					<div className="audio-buttons">
						<SeekButton increment={-30} height={29} width={25} color="#89847D" onClick={this.handlePlayerSeekRequest} />
						{button}
						<SeekButton increment={30} height={29} width={25} color="#89847D" onClick={this.handlePlayerSeekRequest} />
					</div>
					<AudioTrack duration={duration} currentTime={currentTime} percentComplete={percentComplete} onSeek={this.handlePlayerSeekToRequest} />
					<audio
						preload="none"
						ref={this.handlePlayerLoaded}
					>
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
	audio: PropTypes.object.isRequired,
	startTime: PropTypes.number,
	stopTime: PropTypes.number,
	onTimeChange: PropTypes.func,
	hasStandalone: PropTypes.bool,
	onResumeFromStandalone: PropTypes.func,
	hosts: PropTypes.object,
	playing: PropTypes.bool,
	onAudioComplete: PropTypes.func
}

AudioPlayer.defaultProps = {
	audio: {},
	hasStandalone: false,
	hosts: {},
	startTime: 0,
	stopTime: 0,
	onTimeChange: () => {},
	onResumeFromStandalone: () => {},
	playing: false,
	onAudioComplete: () => {}
}

export default AudioPlayer
