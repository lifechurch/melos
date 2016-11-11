import React, { Component, PropTypes } from 'react'
import AudioTriggerImage from './AudioTriggerImage'
import TriggerButton from '../../../../components/TriggerButton'
import DropdownTransition from '../../../../components/DropdownTransition'
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
		return (
			<div className='audio-popup'>
				<TriggerButton image={<AudioTriggerImage />} onClick={this.triggerClick} />
				<DropdownTransition show={this.state.isOpen} classes={'audio-popup-modal'}>
					<div className="header vertical-center horizontal-center">AUDIO</div>
					<div className="body">
						Play Some Audio!
					</div>
				</DropdownTransition>
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