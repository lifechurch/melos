import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import RevManifest from '../../../../../../rev-manifest.json'
import ActionCreators from '../../preview/actions/creators'

class LiveWarningModal extends Component {
	render() {
		const customStyles = {
			content : {
				top                   : '50%',
				left                  : '50%',
				right                 : 'auto',
				bottom                : 'auto',
				marginRight           : '-50%',
				width                 : '500px',
				transform             : 'translate(-50%, -50%)'
			}
		};

		const { modalState, handleClose } = this.props

		let isOpen = false
		let loc = {}
		if (typeof modalState === 'object') {
			loc = modalState.data
			isOpen = modalState.isOpen
		}

		return (
			<Modal isOpen={isOpen} style={customStyles} className='modal__livewarningmodal'>
				<h3>Cannot Delete While Event is Live</h3>
				<p>
					Once an Event has gone live, you cannot delete Text, Bible Reference, and Image modules
					from it because users may have already added their private notes to them. You can, however,
					edit these modules.
				</p>
				<div className='modal-actions text-center'>
					<a className='solid-button gray' onClick={handleClose}>OK</a>
				</div>
			</Modal>
			)
	}
}

export default LiveWarningModal