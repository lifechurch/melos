import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import ActionCreators from '../../preview/actions/creators'

class UnpublishModal extends Component {

	unpublishEvent() {
		const { dispatch, event, handleClose } = this.props
		dispatch(ActionCreators.unpublishEvent({ id: event.item.id }))
		handleClose()
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

		const { modalState, handleClose } = this.props

		let isOpen = false
		let loc = {}
		if (typeof modalState === 'object') {
			loc = modalState.data
			isOpen = modalState.isOpen
		}

		return (
			<Modal isOpen={isOpen} style={customStyles} className='modal__unpublishmodal'>
				<a className='right modal__close' onClick={handleClose}>Cancel</a>
				<h3>Unpublish to Make Changes</h3>
				<p>
					To add, edit, or delete the Locations and Times, temporarily unpublish the event.
					During this time, your event will not be visible in search results. Don’t forget to
					publish your event again.
				</p>
				<div className='modal-actions text-center'>
					<a className='solid-button gray' onClick={::this.unpublishEvent}>Unpublish</a>
				</div>
			</Modal>
			)
	}

}

export default UnpublishModal
