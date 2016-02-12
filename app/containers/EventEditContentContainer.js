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
		dispatch(ActionCreators.new(
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
		dispatch(ActionCreators.new(
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


	handleAddPlan() {
		const { event, dispatch } = this.props
		dispatch(ActionCreators.new(
			Object.assign({},
				createBaseContentObject(event.item.id, 'plan'),
				{
					data: {
						plan_id: 0,
						language_tag: 'en',
						title: '',
						formatted_length: '',
						images: [],
						short_url: ''
					}
				}
			)
		))
	}

	handleAddLink() {
		const { event, dispatch } = this.props
		dispatch(ActionCreators.new(
			Object.assign({},
				createBaseContentObject(event.item.id, 'url'),
				{
					data: {
						// This initial content is validated by validateUrlType
						title: '',
						body: '',
						url: ''
					}
				}
			)
		))
	}

	handleUpdate(index, params) {
		const { event, dispatch } = this.props
		const { content_id } = params
		if (typeof content_id === 'undefined' || content_id <= 0) {
			dispatch(ActionCreators.add(Object.assign({}, {
				...params,
				index
			})))
		} else {
			dispatch(ActionCreators.update(Object.assign({}, {
				...params,
				index
			})))
		}
	}

	handleChange(index, field, value) {
		const { dispatch } = this.props
		dispatch(ActionCreators.setField({
			index,
			field,
			value
		}))
	}

	handleRemove(index, id, content_id) {
		const { event, dispatch } = this.props
		const params = {
			id,
			index,
			content_id
		}
		dispatch(ActionCreators.remove(params))
	}

	render() {
		const { event, plans, dispatch } = this.props
		let contentFeed = (
			<ContentFeed
				dispatch={dispatch}
				event={event}
				plans={plans}
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
					handleAddPlan={::this.handleAddPlan}
					handleAddAnnouncement={::this.handleAddAnnouncement}
					handleAddLink={::this.handleAddLink} />

				<div className='content-container'>
					{contentFeed}
				</div>
			</div>
		)
	}
}

export default EventEditContentContainer
