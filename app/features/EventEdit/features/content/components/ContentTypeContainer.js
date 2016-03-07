import React, { Component, PropTypes } from 'react'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import ContentTypeText from './ContentTypeText'
import ContentTypeAnnouncement from './ContentTypeAnnouncement'
import ContentTypeReference from './ContentTypeReference'
import ContentTypePlan from './ContentTypePlan'
import ContentTypeImage from './ContentTypeImage'
import ContentTypeLink from './ContentTypeLink'
import RevManifest from '../../../../../../app/lib/revManifest'
import ErrorMessage from '../../../../../../app/components/ErrorMessage'

const AUTO_SAVE_TIMEOUT = 3000

class ContentTypeContainer extends Component {

	constructor(props) {
		super(props)
		this.cancelSave = null
	}

	handleUpdateClick() {
		const { content, contentIndex, handleUpdate } = this.props
		if (content.isDirty) {
			handleUpdate(contentIndex, content)
		}
	}

	handleChange(changeEvent, autoSave = true) {
		const { event } = this.props

		if (event.rules.content.canEdit || event.rules.content.canAdd) {
			if (typeof changeEvent.target === 'object') {
				const { contentIndex, handleChange } = this.props
				const { name, value } = changeEvent.target
				handleChange(contentIndex, name, value)
			}

			if (autoSave) {
				this.autoSave()
			}
		}
	}

	handleRemove(removeEvent) {
		const { contentIndex, content, handleRemove, event } = this.props

		if (event.rules.content.canDelete) {
			handleRemove(contentIndex, event.item.id, content.content_id)
		}
	}

	autoSave() {
		const { event, content, handleUpdate } = this.props

		if (typeof this.cancelSave === 'number') {
			clearTimeout(this.cancelSave)
			this.cancelSave = null
		}

		if (event.rules.content.canEdit || event.rules.content.canAdd) {
			this.cancelSave = setTimeout(::this.handleUpdateClick, AUTO_SAVE_TIMEOUT)
		}
	}

	render() {
		const { event, dispatch, contentIndex, content, references, plans } = this.props

		let InnerContainer = null
		switch (content.type) {
			case 'text':
				InnerContainer = (<ContentTypeText handleRemove={::this.handleRemove} handleChange={::this.handleChange} contentData={content.data} />)
				break

			case 'announcement':
				InnerContainer = (<ContentTypeAnnouncement handleRemove={::this.handleRemove} handleChange={::this.handleChange} contentData={content.data} />)
				break

			case 'reference':
				InnerContainer = (<ContentTypeReference
									dispatch={dispatch}
									autoSave={::this.autoSave}
									handleRemove={::this.handleRemove}
									handleChange={::this.handleChange}
									references={references}
									contentIndex={contentIndex}
									isFetching={content.isFetching}
									contentData={content.data} />)
				break

			case 'plan':
				InnerContainer = (<ContentTypePlan
									dispatch={dispatch}
									handleChange={::this.handleChange}
									contentData={content.data}
									contentIndex={contentIndex}
									plans={plans}
									autoSave={::this.autoSave} />)
				break

			case 'url':
				InnerContainer = (<ContentTypeLink handleChange={::this.handleChange} content={content}  />)
				break

			case 'image':
				InnerContainer = (<ContentTypeImage
									dispatch={dispatch}
									handleChange={::this.handleChange}
									contentData={content.data}
									contentIndex={contentIndex} />)
				break
			default:
				break
		}

		let classNames = 'content-type content-' + content.type

		return (
			<div className={classNames} id={`content-${content.sort}`}>
				<Row>
					<div className='medium-12'>
						{content.type.toUpperCase()} <a disabled={!event.rules.content.canDelete} className='right' onClick={::this.handleRemove}><img src={`/images/${RevManifest('thin-x.png')}`} /></a>
						<div className='form-body'>
							<ErrorMessage hasError={content.errors && Object.keys(content.errors).length} errors={content.errors} scope={content.type} />
							{InnerContainer}
							<span className='content-status'>
								{ (content.isDirty && !content.isSaving && !content.hasError) ? 'Content will automatically save a few seconds after you stop typing.' : null }
								{ (content.hasError && !content.isSaving) ? <span className='error-text'>Unable to save. <a onClick={::this.handleUpdateClick}>Try again.</a></span> : null }
								{ (content.isSaved && !content.isSaving && !content.hasError && !content.isDirty) ? 'Last saved ' + content.lastSaved.fromNow() : null }
								{ content.isSaving ? 'Saving...' : null }
							</span>
						</div>
					</div>
				</Row>
			</div>
		)
	}

}

ContentTypeContainer.propTypes = {

}

export default ContentTypeContainer
