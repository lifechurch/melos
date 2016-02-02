import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import ContentHeader from '../features/EventEdit/features/content/components/ContentHeader'
import ContentFeed from '../features/EventEdit/features/content/components/ContentFeed'
import ActionCreators from '../features/EventEdit/features/content/actions/creators'

function createBaseContentObject(eventId, type) {
	return {
		id: eventId,
		type: type,
		sort: 0,
		index: 0
	}
}

class EventEditContentContainer extends Component {
	handleAddText() {
		const { event, dispatch } = this.props
		dispatch(ActionCreators.add(
			Object.assign({}, 
				createBaseContentObject(event.item.id, 'text'),
				{
					data: {
						body: ' '
					}
				}
			)
		))
	}

	handleAddAnnouncement() {
		const { event, dispatch } = this.props
		dispatch(ActionCreators.add(
			Object.assign({}, 
				createBaseContentObject(event.item.id, 'announcement'),
				{
					data: {
						title: ' ',
						body: ' '
					}
				}
			)
		))
	}	

	handleUpdate(index, params) {
		const { event, dispatch } = this.props
		dispatch(ActionCreators.update(Object.assign({}, {
			...params,
			index,
			content_id: params.id,
			id: event.item.id
		})))
	}

	handleChange(index, field, value) {
		const { dispatch } = this.props
		dispatch(ActionCreators.setField({
			index,
			field,
			value
		}))
	}

	handleRemove(index, contentId) {
		const { event, dispatch } = this.props
		const params = {
			index, 
			id: event.item.id, 
			content_id: contentId
		}
		dispatch(ActionCreators.remove(params))
	}

	render() {
		const { event } = this.props		
		let contentFeed = (
			<ContentFeed 
				event={event} 
				handleUpdate={::this.handleUpdate} 
				handleChange={::this.handleChange} 
				handleRemove={::this.handleRemove}
			/>
		)

		if (typeof event !== 'object' || !Array.isArray(event.item.content) || event.item.content.length === 0) {
			contentFeed = (
				<div className='no-content-prompt text-center'>
					<img src='/images/up-arrow-thin.png' />
					<p>Choose some content to get started.</p>
					<a>Need help?</a>
				</div>				
			)
		}

		return (
			<div>
				<Helmet title="Event Content" />
				<ContentHeader 
					handleAddText={::this.handleAddText}
					handleAddAnnouncement={::this.handleAddAnnouncement} />
				<div className='content-container'>
					{contentFeed}
				</div>
			</div>
		)
	}
}

export default EventEditContentContainer