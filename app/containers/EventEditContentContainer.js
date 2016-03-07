import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import Row from '../components/Row'
import Column from '../components/Column'
import { Link } from 'react-router'
import ContentHeader from '../features/EventEdit/features/content/components/ContentHeader'
import ContentFeed from '../features/EventEdit/features/content/components/ContentFeed'
import ActionCreators from '../features/EventEdit/features/content/actions/creators'
import RevManifest from '../../app/lib/revManifest'
import { ActionCreators as ModalActionCreators } from '../actions/modals'
import LiveWarningModal from '../features/EventEdit/features/content/components/LiveWarningModal'

let smoothScroll = {}
if (typeof window !== 'undefined') {
	smoothScroll = require('smooth-scroll')
}

function createBaseContentObject(event, type) {
	let maxSort = 0
	if (Array.isArray(event.item.content)) {
		for (const c of event.item.content) {
			if (c.sort > maxSort) {
				maxSort = c.sort
			}
		}
	}

	return {
		id: event.item.id,
		type: type,
		sort: maxSort + 100,
		index: 0
	}
}

class EventEditContentContainer extends Component {
	handleCloseModal() {
		const { dispatch } = this.props
		dispatch(ModalActionCreators.closeModal('LiveWarning'))
	}

	handleAddText() {
		const { event, dispatch } = this.props
		const newContent = Object.assign({},
			createBaseContentObject(event, 'text'),
			{
				data: {
					body: ''
				}
			}
		)
		dispatch(ActionCreators.new(newContent))
		setTimeout(() => { smoothScroll.animateScroll('#content-' + newContent.sort.toString()) }, 500)
	}

	handleAddAnnouncement() {
		const { event, dispatch } = this.props
		const newContent = Object.assign({},
			createBaseContentObject(event, 'announcement'),
			{
				data: {
					title: '',
					body: ''
				}
			}
		)
		dispatch(ActionCreators.new(newContent))
		setTimeout(() => { smoothScroll.animateScroll('#content-' + newContent.sort.toString()) }, 500)
	}

	handleAddReference() {
		const { event, dispatch } = this.props
		const newContent =Object.assign({},
			createBaseContentObject(event, 'reference'),
			{
				data: {
					version_id: 1,
					chapter: '',
					human: ' ',
					usfm: ['']
				}
			}
		)
		dispatch(ActionCreators.new(newContent))
		setTimeout(() => { smoothScroll.animateScroll('#content-' + newContent.sort.toString()) }, 500)
	}

	handleAddPlan() {
		const { event, dispatch } = this.props
		const newContent = Object.assign({},
			createBaseContentObject(event, 'plan'),
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
		dispatch(ActionCreators.new(newContent))
		setTimeout(() => { smoothScroll.animateScroll('#content-' + newContent.sort.toString()) }, 500)
	}

	handleAddImage() {
		const { event, dispatch } = this.props
		const newContent = Object.assign({},
			createBaseContentObject(event, 'image'),
			{
				data: {
					image_id: '0',
					body: ''
				}
			}
		)
		dispatch(ActionCreators.new(newContent))
		setTimeout(() => { smoothScroll.animateScroll('#content-' + newContent.sort.toString()) }, 500)
	}

	handleAddLink() {
		const { event, dispatch } = this.props
		const newContent = Object.assign({},
			createBaseContentObject(event, 'url'),
			{
				data: {
					// This initial content is validated by validateUrlType
					title: '',
					body: '',
					url: ''
				}
			}
		)
		dispatch(ActionCreators.new(newContent))
		setTimeout(() => { smoothScroll.animateScroll('#content-' + newContent.sort.toString()) }, 500)
	}

	handleAddGiving() {
		const { event, dispatch } = this.props
		const newContent = Object.assign({},
			createBaseContentObject(event, 'url'),
			{
				iamagivinglink: true,
				data: {
					title: '',
					body: '',
					url: ''
				}
			}
		)
		dispatch(ActionCreators.new(newContent))
		setTimeout(() => { smoothScroll.animateScroll('#content-' + newContent.sort.toString()) }, 500)
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
		if (typeof event.rules.content.canDelete === 'object') {
			const { modal } = event.rules.content.canDelete
			dispatch(ModalActionCreators.openModal(modal))
		} else {
			const params = {
				id,
				index,
				content_id
			}
			dispatch(ActionCreators.remove(params))
		}
	}

	handleMove(fromIndex, toIndex) {
		const { dispatch } = this.props
		dispatch(ActionCreators.move({fromIndex, toIndex}))
	}

	handleStartReorder() {
		const { dispatch } = this.props
	 	dispatch(ActionCreators.startReorder())
	}

	handleReorder() {
		const { dispatch, event } = this.props
		const content_ids = event.item.content.map((c,i) => {
			return c.content_id
		})
		dispatch(ActionCreators.reorder({id: event.item.id, content_ids}))
	}

	render() {
		const { event, references, plans, dispatch, modals } = this.props

		let contentFeed
		if (typeof event !== 'object' || !Array.isArray(event.item.content) || event.item.content.length === 0) {
			contentFeed = (
				<div className='no-content-prompt text-center'>
					<img src={`/images/${RevManifest('up-arrow-thin.png')}`} />
					<p>Choose some content to get started.</p>
					<a target="_blank" href="http://help.youversion.com">Need help?</a>
				</div>
			)
		} else {
			contentFeed = (
				<ContentFeed
					dispatch={dispatch}
					event={event}
					references={references}
					plans={plans}
					handleUpdate={::this.handleUpdate}
					handleChange={::this.handleChange}
					handleRemove={::this.handleRemove}
					handleMove={::this.handleMove}
					handleStartReorder={::this.handleStartReorder}
					handleReorder={::this.handleReorder}
				/>
			)
		}

		return (
			<div>
				<Helmet title="Event Content" />
				<ContentHeader
					handleAddText={::this.handleAddText}
					handleAddReference={::this.handleAddReference}
					handleAddPlan={::this.handleAddPlan}
					handleAddAnnouncement={::this.handleAddAnnouncement}
					handleAddLink={::this.handleAddLink}
					handleAddGiving={::this.handleAddGiving}
					modals={modals}
					dispatch={dispatch}
					event={event}
					handleAddImage={::this.handleAddImage}
				/>
				<div className='content-container'>
					{contentFeed}
				</div>
				<Row>
					<Column s='medium-6'>
						<Link disabled={!event.rules.details.canView} to={`/event/edit/${event.item.id}/locations_and_times`}>&larr; Previous: Locations & Times</Link>
					</Column>
					<Column s='medium-6' a='right'>
						<Link disabled={!event.rules.preview.canView} to={`/event/edit/${event.item.id}/preview`}>Next: Preview &rarr;</Link>
					</Column>
				</Row>
				<LiveWarningModal event={event} dispatch={dispatch} modalState={modals.LiveWarning} handleClose={::this.handleCloseModal} />
			</div>
		)
	}
}

export default EventEditContentContainer
