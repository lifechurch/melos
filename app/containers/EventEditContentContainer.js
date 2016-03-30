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
import cookie from 'react-cookie'

let smoothScroll = {}
if (typeof window !== 'undefined') {
	smoothScroll = require('smooth-scroll')
	smoothScroll.init({ selectorHeader: '.content-header', offset: 20 })
}

function createBaseContentObject(event, type, insertionPoint) {
	let newSort = insertionPoint
	if (typeof insertionPoint === 'undefined' || insertionPoint === 0) {
		newSort = event.item.content.length
	}

	return {
		id: event.item.id,
		type: type,
		sort: (newSort * 100) - 50,
		index: newSort
	}
}

class EventEditContentContainer extends Component {
	handleCloseModal() {
		const { dispatch } = this.props
		dispatch(ModalActionCreators.closeModal('LiveWarning'))
	}

	handleAddText() {
		const { event, dispatch, _content } = this.props
		const newContent = Object.assign({},
			createBaseContentObject(event, 'text', _content.insertionPoint),
			{
				data: {
					body: ''
				}
			}
		)
		dispatch(ActionCreators.new(newContent))
		setTimeout(() => { smoothScroll.animateScroll('#content-' + newContent.index.toString()) }, 250)
	}

	handleAddAnnouncement() {
		const { event, dispatch, _content } = this.props
		const newContent = Object.assign({},
			createBaseContentObject(event, 'announcement', _content.insertionPoint),
			{
				data: {
					title: '',
					body: ''
				}
			}
		)
		dispatch(ActionCreators.new(newContent))
		setTimeout(() => { smoothScroll.animateScroll('#content-' + newContent.index.toString()) }, 250)
	}

	handleAddReference() {
		const { event, dispatch, _content } = this.props
		const lastBibleVersion = cookie.load('last_bible_version')
		const lastBibleBook = cookie.load('last_bible_book')
		const newContent =Object.assign({},
			createBaseContentObject(event, 'reference', _content.insertionPoint),
			{
				data: {
					version_id:  (typeof lastBibleVersion === 'undefined') ? 1 : lastBibleVersion,
					chapter: '',
					human: ' ',
					usfm: [(typeof lastBibleBook === 'undefined') ? '' : lastBibleBook]
				}
			}
		)
		dispatch(ActionCreators.new(newContent))
		setTimeout(() => { smoothScroll.animateScroll('#content-' + newContent.index.toString()) }, 250)
	}

	handleAddPlan() {
		const { event, dispatch, _content } = this.props
		const newContent = Object.assign({},
			createBaseContentObject(event, 'plan', _content.insertionPoint),
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
		setTimeout(() => { smoothScroll.animateScroll('#content-' + newContent.index.toString()) }, 250)
	}

	handleAddImage() {
		const { event, dispatch, _content } = this.props
		const newContent = Object.assign({},
			createBaseContentObject(event, 'image', _content.insertionPoint),
			{
				data: {
					image_id: '0',
					body: ''
				}
			}
		)
		dispatch(ActionCreators.new(newContent))
		setTimeout(() => { smoothScroll.animateScroll('#content-' + newContent.index.toString()) }, 250)
	}

	handleAddLink() {
		const { event, dispatch, _content } = this.props
		const newContent = Object.assign({},
			createBaseContentObject(event, 'url', _content.insertionPoint),
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
		setTimeout(() => { smoothScroll.animateScroll('#content-' + newContent.index.toString()) }, 250)
	}

	handleAddGiving() {
		const { event, dispatch, _content } = this.props
		const newContent = Object.assign({},
			createBaseContentObject(event, 'url', _content.insertionPoint),
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
		setTimeout(() => { smoothScroll.animateScroll('#content-' + newContent.index.toString()) }, 250)
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
		const { event, references, plans, dispatch, modals, _content } = this.props

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
					_content={_content}
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
						<Link disabled={!event.rules.details.canView || event.isReordering} to={`/event/edit/${event.item.id}/locations_and_times`}>&larr; Previous: Locations & Times</Link>
					</Column>
					<Column s='medium-6' a='right'>
						<Link disabled={!event.rules.preview.canView || event.isReordering} to={`/event/edit/${event.item.id}/preview`}>Next: Preview &rarr;</Link>
					</Column>
				</Row>
				<LiveWarningModal event={event} dispatch={dispatch} modalState={modals.LiveWarning} handleClose={::this.handleCloseModal} />
			</div>
		)
	}
}

export default EventEditContentContainer
