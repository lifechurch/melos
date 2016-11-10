import React, { Component, PropTypes } from 'react'
import AudioTriggerImage from './AudioTriggerImage'
import TriggerButton from '../../../../components/TriggerButton'
//import LocalStore from '../../../../lib/localStore'

class AudioPopup extends Component {
	constructor(props) {
		super(props)

		this.state = {
			isOpen: false
		}

		this.triggerClick = ::this.triggerClick
	}

	triggerClick(isOpen) {
		this.setState({ isOpen: !this.state.isOpen })
	}

	render() {
		const modalClass = this.state.isOpen ? '' : 'hide-modal'
		return (
			<div className='audio-popup'>
				<TriggerButton image={<AudioTriggerImage />} onClick={this.triggerClick} />
				<div className={`modal ${modalClass}`}>
					<div className="audio-popup-modal">
						<div className="header vertical-center horizontal-center">AUDIO</div>
						<div className="body">
							Play Some Audio!
						</div>
					</div>
				</div>
			</div>
		)
	}
}

AudioPopup.propTypes = {
	audio: React.PropTypes.object.isRequired
}

AudioPopup.defaultProps = {

}

export default AudioPopup