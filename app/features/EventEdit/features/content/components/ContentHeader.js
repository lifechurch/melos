import React, { Component, PropTypes } from 'react'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import { ActionCreators as ModalActionCreators } from '../../../../../../app/actions/modals'
import ContentHelpModal from '../../../../../../app/features/EventEdit/features/content/components/ContentHelpModal'
import { FormattedMessage } from 'react-intl'

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
						<a disabled={!event.rules.content.canAdd || event.isReordering} onClick={handleAddText} className='hollow-button green'><FormattedMessage id="features.EventEdit.features.content.components.ContentHeader.text" /></a>
						<a disabled={!event.rules.content.canAdd || event.isReordering} onClick={handleAddReference} className='hollow-button green'><FormattedMessage id="features.EventEdit.features.content.components.ContentHeader.reference" /></a>
						<a disabled={!event.rules.content.canAdd || event.isReordering} onClick={handleAddPlan} className='hollow-button green'><FormattedMessage id="features.EventEdit.features.content.components.ContentHeader.plan" /></a>
						<a disabled={!event.rules.content.canAdd || event.isReordering} onClick={handleAddImage} className='hollow-button green'><FormattedMessage id="features.EventEdit.features.content.components.ContentHeader.image" /></a>
						<a disabled={!event.rules.content.canAdd || event.isReordering} onClick={handleAddLink} className='hollow-button green'><FormattedMessage id="features.EventEdit.features.content.components.ContentHeader.link" /></a>
						<a disabled={!event.rules.content.canAdd || event.isReordering} onClick={handleAddGiving} className='hollow-button green'><FormattedMessage id="features.EventEdit.features.content.components.ContentHeader.giving" /></a>
						<a disabled={!event.rules.content.canAdd || event.isReordering} onClick={handleAddAnnouncement} className='hollow-button green'><FormattedMessage id="features.EventEdit.features.content.components.ContentHeader.announcement" /></a>
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
