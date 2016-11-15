import React, { Component, PropTypes } from 'react'
import AudioTriggerImage from './AudioTriggerImage'
import TriggerButton from '../../../../components/TriggerButton'
import AudioPlayer from './AudioPlayer'
import { FormattedMessage } from 'react-intl'
import LocalStore from '../../../../lib/localStore'

class AudioPopup extends Component {
	constructor(props) {
		super(props)

		this.state = {
			isOpen: false,
			percentComplete: 0,
			currentTime: 0,
			hasStandalone: false
		}

		this.triggerClick = ::this.triggerClick
		this.handleTimeChange = ::this.handleTimeChange
		this.openInNewWindow = ::this.openInNewWindow
		this.handleResumeFromStandalone = ::this.handleResumeFromStandalone
	}

	triggerClick(isOpen) {
		this.setState({ isOpen: !this.state.isOpen })
	}

	handleTimeChange(e) {
		const { percentComplete, currentTime } = e
		this.setState({ percentComplete, currentTime })
	}

	handleResumeFromStandalone() {
		this.setState({ hasStandalone: false })
	}

	openInNewWindow() {
		this.setState({ hasStandalone: true })
	}

	render() {
		const { percentComplete, hasStandalone } = this.state
		const modalClass = this.state.isOpen ? '' : 'hide-modal'
		return (
			<div className='audio-popup'>
				<TriggerButton image={<AudioTriggerImage percentComplete={percentComplete} width={40} height={40} />} onClick={this.triggerClick} />
				<div className={`modal ${modalClass}`}>
					<div className="audio-popup-modal">
						<div className="header vertical-center horizontal-center"><FormattedMessage id="bible.audio" /></div>
						<div className="body">
							<AudioPlayer {...this.props} onTimeChange={this.handleTimeChange} hasStandalone={hasStandalone} onResumeFromStandalone={this.handleResumeFromStandalone} />
							<a onClick={this.openInNewWindow}><FormattedMessage id="open.new.window" /></a>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

AudioPopup.propTypes = {
	audio: React.PropTypes.object.isRequired,
	hosts: React.PropTypes.object.isRequired
}

AudioPopup.defaultProps = {
	audio: {},
	hosts: {}
}

export default AudioPopup