/* eslint-disable react/jsx-handler-names */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import AudioTriggerImage from './AudioTriggerImage'
import TriggerButton from '../../../../components/TriggerButton'
import AudioPlayer from './AudioPlayer'
import DropdownTransition from '../../../../components/DropdownTransition'

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

	triggerClick(e) {
		this.setState({ isOpen: e.isOpen })
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

	closeDropdown = () => {
		this.setState({ isOpen: false })
	}


	render() {
		const { enabled, audio, hosts, startTime, stopTime, onAudioComplete, playing } = this.props
		const { percentComplete, hasStandalone, isOpen } = this.state
		// <a onClick={this.openInNewWindow}><FormattedMessage id="Reader.header.audio label" /></a>
		return (
			<div className='audio-popup'>
				<TriggerButton
					isOpen={isOpen}
					enabled={enabled}
					image={
						<AudioTriggerImage
							percentComplete={percentComplete}
							width={35}
							height={35}
      />
					}
					onClick={this.triggerClick}
    />
				<DropdownTransition
					classes='audio-popup-modal'
					exemptClass='audio-popup'
					show={isOpen}
					onOutsideClick={this.closeDropdown}
    >
					<div className='header'>
						<a tabIndex={0} className='cancel' onClick={this.closeDropdown}>
							<FormattedMessage id='Reader.header.cancel' />
						</a>
						<FormattedMessage id='Reader.header.audio label' />
					</div>
					<div className='body'>
						<AudioPlayer
							onAudioComplete={onAudioComplete}
							playing={playing}
							audio={audio}
							hosts={hosts}
							startTime={startTime}
							stopTime={stopTime}
							onTimeChange={this.handleTimeChange}
							hasStandalone={hasStandalone}
							onResumeFromStandalone={this.handleResumeFromStandalone}
						/>
					</div>
				</DropdownTransition>
			</div>
		)
	}
}

AudioPopup.propTypes = {
	audio: PropTypes.object.isRequired,
	hosts: PropTypes.object.isRequired,
	enabled: PropTypes.bool.isRequired,
	startTime: PropTypes.number,
	stopTime: PropTypes.number,
	onAudioComplete: PropTypes.func,
	playing: PropTypes.bool
}

AudioPopup.defaultProps = {
	audio: {},
	hosts: {},
	startTime: 0,
	stopTime: null,
	onAudioComplete: () => {},
	playing: false
}

export default AudioPopup
