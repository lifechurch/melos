import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import ThinXImage from '../../../../../../images/thin-x.png'

class ContentHelpModal extends Component {

	handleConfirm() {
		const { handleDelete, modalState } = this.props
		handleDelete(modalState.data)
	}

	render() {
		const customStyles = {
			overlay: {
				overflowX: 'hidden',
				overflowY: 'auto'
			},
			content: {
				bottom: 'auto',
				left: '50%',
				right: 'auto',
				marginRight: '-50%',
				width: '500px',
				transform: 'translateX(-50%)'
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
			<Modal isOpen={isOpen} style={customStyles} className='modal__contenthelpmodal'>
				<a className='right modal__close' onClick={handleClose}><img src={ThinXImage} /></a>
				<FormattedMessage tagName="h3" id="features.EventEdit.features.content.components.ContentHelpModal.types" />
				<FormattedMessage tagName="h6" id="features.EventEdit.features.content.components.ContentHelpModal.text.title" />
				<a className="learnLink"><FormattedHTMLMessage id="features.EventEdit.features.content.components.ContentHelpModal.learn" /></a>
				<p className="textModule"><FormattedMessage id="features.EventEdit.features.content.components.ContentHelpModal.text.desc" /></p>

				<FormattedMessage tagName="h6" id="features.EventEdit.features.content.components.ContentHelpModal.reference.title" />
				<FormattedMessage tagName="p" id="features.EventEdit.features.content.components.ContentHelpModal.reference.desc" />

				<FormattedMessage tagName="h6" id="features.EventEdit.features.content.components.ContentHelpModal.plan.title" />
				<FormattedMessage tagName="p" id="features.EventEdit.features.content.components.ContentHelpModal.plan.desc" />

				<FormattedMessage tagName="h6" id="features.EventEdit.features.content.components.ContentHelpModal.image.title" />
				<FormattedMessage tagName="p" id="features.EventEdit.features.content.components.ContentHelpModal.image.desc" />

				<FormattedMessage tagName="h6" id="features.EventEdit.features.content.components.ContentHelpModal.link.title" />
				<FormattedMessage tagName="p" id="features.EventEdit.features.content.components.ContentHelpModal.link.desc" />

				<FormattedMessage tagName="h6" id="features.EventEdit.features.content.components.ContentHelpModal.announcement.title" />
				<FormattedMessage tagName="p" id="features.EventEdit.features.content.components.ContentHelpModal.announcement.desc" />
			</Modal>
		)
	}

}

export default ContentHelpModal
