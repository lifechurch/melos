import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import ActionCreators from '../../preview/actions/creators'
import { FormattedMessage } from 'react-intl'

class UnpublishModal extends Component {

	unpublishEvent() {
		const { dispatch, event, handleClose } = this.props
		dispatch(ActionCreators.unpublishEvent({ id: event.item.id }))
		handleClose()
	}

	render() {
		const customStyles = {
			content: {
				top: '50%',
				left: '50%',
				right: 'auto',
				bottom: 'auto',
				marginRight: '-50%',
				width: '500px',
				transform: 'translate(-50%, -50%)'
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
				<a className='right modal__close' onClick={handleClose}><FormattedMessage id="features.EventEdit.features.location.components.UnpublishModal.cancel" /></a>
				<FormattedMessage tagName="h3" id="features.EventEdit.features.location.components.UnpublishModal.title" />
				<FormattedMessage tagName="p" id="features.EventEdit.features.location.components.UnpublishModal.desc" />
				<div className='modal-actions text-center'>
					<a className='solid-button gray' onClick={::this.unpublishEvent}><FormattedMessage id="features.EventEdit.features.location.components.UnpublishModal.unpublish" /></a>
				</div>
			</Modal>
		)
	}

}

export default UnpublishModal
