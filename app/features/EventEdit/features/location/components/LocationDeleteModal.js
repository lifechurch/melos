import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import ActionCreators from '../../../../../actions/modals'

class LocationDeleteModal extends Component {

	handleConfirm() {
		const { handleDelete, modalState } = this.props
		handleDelete(modalState.data)
	}

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

		const { modalState, handleDelete, handleClose } = this.props

		let isOpen = false
		let loc = {}
		if (typeof modalState === 'object') {
			loc = modalState.data
			isOpen = modalState.isOpen
		}

		return (
			<Modal isOpen={isOpen} style={customStyles}>
				<h3>Are you sure?</h3>
				<p>You have selected the following location to be deleted:</p>
				<p><b>{loc.name}</b></p>
				<p>This will remove the location from all past and present events. You will not be able to re-use this lcoation for future events.</p>
				<div className='modal-actions'>
					<a onClick={handleClose}>Cancel</a>
					<a className='solid-button red' onClick={::this.handleConfirm}>Delete</a>
				</div>
			</Modal>
		)
	}

}

export default LocationDeleteModal