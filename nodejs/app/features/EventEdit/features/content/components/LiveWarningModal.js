import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import ActionCreators from '../../preview/actions/creators'
import { FormattedMessage } from 'react-intl'

class LiveWarningModal extends Component {
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
			<Modal isOpen={isOpen} style={customStyles} className='modal__livewarningmodal'>
				<FormattedMessage tagName="h3" id="features.EventEdit.features.content.components.LiveWarningModal.title" />
				<FormattedMessage tagName="p" id="features.EventEdit.features.content.components.LiveWarningModal.desc" />
				<div className='modal-actions text-center'>
					<a className='solid-button gray' onClick={handleClose}><FormattedMessage id="features.EventEdit.features.content.components.LiveWarningModal.ok" /></a>
				</div>
			</Modal>
		)
	}
}

export default LiveWarningModal
