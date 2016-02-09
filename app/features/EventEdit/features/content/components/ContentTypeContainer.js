import React, { Component, PropTypes } from 'react'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import ContentTypeText from './ContentTypeText'
import ContentTypeAnnouncement from './ContentTypeAnnouncement'
import ContentTypePlan from './ContentTypePlan'

const AUTO_SAVE_TIMEOUT = 5000

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

	handleChange(changeEvent) {
		if (typeof changeEvent.target === 'object') {
			const { contentIndex, handleChange } = this.props
			const { name, value } = changeEvent.target
			handleChange(contentIndex, name, value)
		}

		this.autoSave()
	}

	handlePlanSearchChange(changeEvent) {
		console.log(changeEvent)
		console.log(changeEvent.target)
		const { contentIndex, handlePlanSearchChange } = this.props
		const { name, value } = changeEvent.target
		console.log(name, value)
		handlePlanSearchChange(contentIndex, name, value)
	}

	handlePlanSearchFocus(focusEvent) {
		const { contentIndex, handlePlanSearchFocus } = this.props
		handlePlanSearchFocus(contentIndex)
	}

	handlePlanAdd(clickEvent) {
		const { contentIndex, handleChange, clearPlanSearch, plans } = this.props
		const plan_id = parseInt(clickEvent.currentTarget.dataset['plan_id'])
		handleChange(contentIndex, 'plan_id', plan_id)

		// Find in plans[]
		// If we knew the index, we could just pass it directly
		var selectedPlan;
		selectedPlan = 0
		for( var i in plans.items ){
			if( plans.items[i].id == plan_id ) {
				selectedPlan = plans.items[i];
				break;
			}
		}

		// Would be nice to be able to pass JSON
		handleChange(contentIndex, 'title', selectedPlan.name.default)
		handleChange(contentIndex, 'formatted_length', selectedPlan.formatted_length.default)
		handleChange(contentIndex, 'images', selectedPlan.images)
		handleChange(contentIndex, 'short_url', selectedPlan.short_url)

		clearPlanSearch()
		this.autoSave()
	}

	handlePlanRemove(clickEvent) {
		const { contentIndex, handleChange } = this.props
		handleChange(contentIndex, 'plan_id', 0)
		this.autoSave()
	}

	handleRemove(removeEvent) {
		const { contentIndex, content, handleRemove, event } = this.props
		handleRemove(contentIndex, event.item.id, content.content_id)
	}

	autoSave() {
		const { content, handleUpdate } = this.props

		if (typeof this.cancelSave === 'number') {
			clearTimeout(this.cancelSave)
			this.cancelSave = null
		}

		this.cancelSave = setTimeout(::this.handleUpdateClick, AUTO_SAVE_TIMEOUT)
	}

	render() {
		const { contentIndex, content, plans } = this.props

		let InnerContainer = null
		switch (content.type) {
			case 'text':
				InnerContainer = (<ContentTypeText handleRemove={::this.handleRemove} handleChange={::this.handleChange} contentData={content.data} />)
				break

			case 'announcement':
				InnerContainer = (<ContentTypeAnnouncement handleRemove={::this.handleRemove} handleChange={::this.handleChange} contentData={content.data} />)
				break

			case 'reference':
			case 'plan':
				InnerContainer = (<ContentTypePlan
									handlePlanSearchChange={::this.handlePlanSearchChange}
									handlePlanAdd={::this.handlePlanAdd}
									handlePlanRemove={::this.handlePlanRemove}
									handlePlanSearchFocus={::this.handlePlanSearchFocus}
									contentData={content.data}
									contentIndex={contentIndex}
									plans={plans} />)
				break

			case 'url':
			case 'image':

			default:
				break
		}

		return (
			<div className='content-type-text'>
				<Row>
					<div className='medium-10 large-8 columns small-centered'>
						{content.type.toUpperCase()} <a className='right' onClick={::this.handleRemove}><img src='/images/thin-x.png' /></a>
						<div className='form-body'>
							{InnerContainer}
							{ content.isDirty ? 'D' : '.'}
							{ content.isSaving ? 'Saving...' : '.'}
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
