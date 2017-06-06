import React, { Component, PropTypes } from 'react'
import AudioTriggerImage from './AudioTriggerImage'
import TriggerButton from '../../../../components/TriggerButton'
import AudioPlayer from './AudioPlayer'
import { FormattedMessage } from 'react-intl'
import LocalStore from '../../../../lib/localStore'
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
		const { percentComplete, hasStandalone, isOpen } = this.state
		const { enabled } = this.props
		// <a onClick={this.openInNewWindow}><FormattedMessage id="Reader.header.audio label" /></a>
		return (
			<div className='audio-popup'>
				<TriggerButton isOpen={isOpen} enabled={enabled} image={<AudioTriggerImage percentComplete={percentComplete} width={35} height={35} />} onClick={this.triggerClick} />
				<DropdownTransition show={isOpen} classes={'audio-popup-modal'} onOutsideClick={this.closeDropdown} exemptClass='audio-popup'>
					<div className="header">
						<a className='cancel' onClick={this.closeDropdown}>
							<FormattedMessage id="Reader.header.cancel" />
						</a>
						<FormattedMessage id="Reader.header.audio label" />
					</div>
					<div className="body">
						<AudioPlayer {...this.props} onTimeChange={this.handleTimeChange} hasStandalone={hasStandalone} onResumeFromStandalone={this.handleResumeFromStandalone} />
					</div>
				</DropdownTransition>
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
