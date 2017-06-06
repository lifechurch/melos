import React, { Component, PropTypes } from 'react'

class AudioTrack extends Component {
	constructor(props) {
		super(props)

		this.onMouseUp = ::this.onMouseUp
		this.initialize = ::this.initialize
	}

	initialize(el) {
		this.el = el
	}

	onMouseUp(e) {
		const { duration, onSeek } = this.props
		if (typeof onSeek === 'function' && duration > 0) {
			const rect = this.el.getBoundingClientRect()
			onSeek(((e.pageX - rect.left) / rect.width) * duration)
		}
	}

	render() {
		const { percentComplete, duration, currentTime } = this.props
		return (
			<div className="audio-track" onMouseUp={this.onMouseUp} ref={this.initialize}>
				<div
					className="audio-track-progress"
					style={{ transform: `translate(${-1* (100 - percentComplete)}%, 0)`}} >
					&nbsp;
				</div>
			</div>
		)
	}
}

AudioTrack.propTypes = {
	percentComplete: React.PropTypes.number,
	duration: React.PropTypes.number,
	currentTime: React.PropTypes.number,
	onSeek: React.PropTypes.func
}

AudioTrack.defaultProps = {
	percentComplete: 0,
	duration: 0,
	currentTime: 0
}

export default AudioTrack