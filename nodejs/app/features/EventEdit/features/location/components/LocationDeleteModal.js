import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import ActionCreators from '../../../../../actions/modals'
import { FormattedMessage } from 'react-intl'

class LocationDeleteModal extends Component {

	handleConfirm() {
		const { handleDelete, modalState } = this.props
		handleDelete(modalState.data)
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

		const { modalState, handleDelete, handleClose } = this.props

		let isOpen = false
		let loc = {}
		if (typeof modalState === 'object') {
			loc = modalState.data
			isOpen = modalState.isOpen
		}

		return (
			<Modal isOpen={isOpen} style={customStyles}>
				<FormattedMessage tagName="h3" id="features.EventEdit.features.location.components.LocationDeleteModal.sure" />
				<FormattedMessage tagName="p" id="features.EventEdit.features.location.components.LocationDeleteModal.selected" />
				<p><b>{loc.name}</b></p>
				<FormattedMessage tagName="p" id="features.EventEdit.features.location.components.LocationDeleteModal.warn" />
				<div className='modal-actions'>
					<a onClick={handleClose}><FormattedMessage id="features.EventEdit.features.location.components.LocationDeleteModal.cancel" /></a>
					<a className='solid-button red' onClick={::this.handleConfirm}><FormattedMessage id="features.EventEdit.features.location.components.LocationDeleteModal.delete" /></a>
				</div>
			</Modal>
		)
	}

}

export default LocationDeleteModal
