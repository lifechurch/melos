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
<<<<<<< 89faba1697f11e3b4532ea46ca1d79deb91bc53a
		dispatch(ActionCreators.new(
			Object.assign({},
=======
		dispatch(ActionCreators.add(
			Object.assign({},
>>>>>>> Content.Plan initial commit. Adds naked id, language_tag fields.
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
<<<<<<< 89faba1697f11e3b4532ea46ca1d79deb91bc53a
		dispatch(ActionCreators.new(
			Object.assign({},
=======
		dispatch(ActionCreators.add(
			Object.assign({},
>>>>>>> Content.Plan initial commit. Adds naked id, language_tag fields.
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
		dispatch(ActionCreators.add(
			Object.assign({},
				createBaseContentObject(event.item.id, 'plan'),
				{
					data: {
						plan_id: 0,
						language_tag: ' '
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

	handlePlanSearchChange(index, field, value) {
		const { dispatch } = this.props
		dispatch(ActionCreators.setPlanField({
			index,
			field,
			value
		}))

		if (value.length > 2) {
			console.log('Dispatch .searchPlans(), value.length > 2')
			dispatch(ActionCreators.searchPlans({
				index,
				query: value,
				language_tag: 'en'
			}))
		}
	}

	render() {
		const { event, plans } = this.props
		let contentFeed = (
			<ContentFeed
				event={event}
				plans={plans}
				handleUpdate={::this.handleUpdate}
				handleChange={::this.handleChange}
				handleRemove={::this.handleRemove}
				handlePlanSearchChange={::this.handlePlanSearchChange}
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
					handleAddAnnouncement={::this.handleAddAnnouncement} />
				<div className='content-container'>
					{contentFeed}
				</div>
			</div>
		)
	}
}

export default EventEditContentContainer
