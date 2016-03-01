import React, { Component, PropTypes } from 'react'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import { ActionCreators as ModalActionCreators } from '../../../../../../app/actions/modals'
import ContentHelpModal from '../../../../../../app/features/EventEdit/features/content/components/ContentHelpModal'


class ContentHeader extends Component {

	handleCreate(clickEvent) {

	}

	handleCloseModal() {
		const { dispatch } = this.props
		dispatch(ModalActionCreators.closeModal('ContentHelp'))
	}

	handleOpenModal(loc) {
		const { dispatch } = this.props
		dispatch(ModalActionCreators.openModal('ContentHelp', loc))
	}

	render() {
		const { event, handleAddText, handleAddLink, handleAddAnnouncement, handleAddReference, handleAddPlan, handleAddImage, handleAddGiving, modals } = this.props
		return (
			<div className='content-header'>
				<Row>
					<Column s='medium-12'>
						<a disabled={!event.rules.content.canAdd} onClick={handleAddText} className='hollow-button green'>Text</a>
						<a disabled={!event.rules.content.canAdd} onClick={handleAddReference} className='hollow-button green'>Bible Reference</a>
						<a disabled={!event.rules.content.canAdd} onClick={handleAddPlan} className='hollow-button green'>Plan</a>
						<a disabled={!event.rules.content.canAdd} onClick={handleAddImage} className='hollow-button green'>Image</a>
						<a disabled={!event.rules.content.canAdd} onClick={handleAddLink} className='hollow-button green'>External Link</a>
						<a disabled={!event.rules.content.canAdd} onClick={handleAddGiving} className='hollow-button green'>Giving Link</a>
						<a disabled={!event.rules.content.canAdd} onClick={handleAddAnnouncement} className='hollow-button green'>Announcement</a>
						<div className='right'>
							<a onClick={::this.handleOpenModal}>?</a>
						</div>
					</Column>
				</Row>
				<ContentHelpModal modalState={modals.ContentHelp} handleClose={::this.handleCloseModal} />
			</div>
		)
	}

}

ContentHeader.propTypes = {

}

export default ContentHeader
