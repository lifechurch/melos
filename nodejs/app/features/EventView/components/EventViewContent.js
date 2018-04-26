import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Row from '../../../components/Row'
import Textarea from '../../../components/Textarea'
import moment from 'moment'
import ActionCreators from '../actions/creators'
import EventViewContentMeta from './EventViewContentMeta'
import EventViewContentText from './EventViewContentText'
import EventViewContentLink from './EventViewContentLink'
import EventViewContentImage from './EventViewContentImage'
import EventViewContentPlan from './EventViewContentPlan'
import EventViewContentReference from './EventViewContentReference'
import EventViewContentAnnouncement from './EventViewContentAnnouncement'
import { FormattedHTMLMessage } from 'react-intl'


const AUTO_SAVE_TIMEOUT = 3000

class EventViewContent extends Component {

	constructor(props) {
		super(props)

	}

	handleEditNote(e) {
		const { dispatch, index } = this.props
		dispatch(ActionCreators.editNote(index, e.target.value))

		if (typeof this.cancelSave === 'number') {
			clearTimeout(this.cancelSave)
			this.cancelSave = null
		}

		this.cancelSave = setTimeout(::this.save, AUTO_SAVE_TIMEOUT)
	}

	save() {
		const { dispatch, id, content } = this.props
		const comments = { [content.content_id]: content.comment }
		dispatch(ActionCreators.saveNote({ id, comments }))
	}

	render() {
		const { dispatch, auth, reference, content, index, intl } = this.props
		let contentItem, meta_links, notes




		switch (content.type) {
			case 'text':
					 if (typeof document !== 'undefined') {
					   var output = document.createElement('DIV');
					   output.innerHTML = content.data.body;
					   var output = output.textContent || output.innerText || '';
					} else {
						output = ''
					}
				contentItem = <EventViewContentText intl={intl} contentData={content.data} meta_links={meta_links} />
				meta_links = [
						{ label: intl.formatMessage({ id: 'features.EventView.components.EventViewContent.copy' }), payload: output },
						{ label: intl.formatMessage({ id: 'features.EventView.components.EventViewContent.share' }), payload: { url: '', title: output } }
				]
				notes = true
				break

			case 'url':
				contentItem = <EventViewContentLink intl={intl} contentData={content.data} />
				break

			case 'announcement':
				contentItem = <EventViewContentAnnouncement intl={intl} contentData={content.data} />
				break

			case 'image':
				var urls = []
				if (content.data.urls) {
					urls = content.data.urls.filter((i) => { if (i.width == 640 && i.height == 640) { return true } })
				}
				contentItem = <EventViewContentImage intl={intl} contentData={content.data} />
					// meta_links = [{label: 'Share', payload: {url: urls.length ? urls[0].url : null, title: ''}}]
				notes = true
				break

			case 'reference':
				var human = `${content.data.human.split(':')[0]}:${
									content.data.human.split(', ').map((v) => { return v.split(':')[1] }).join()}`
				var url = `https://bible.com/${content.data.version_id}/${
								    content.data.usfm[0].split('.').slice(0, 2).join('.')}.${
								    content.data.human.split(', ').map((v) => { return v.split(':')[1] }).join()}`

				contentItem = <EventViewContentReference intl={intl} contentData={content.data} contentIndex={index} dispatch={dispatch} reference={reference} />
				meta_links = [
						{ label: intl.formatMessage({ id: 'features.EventView.components.EventViewContent.read' }), payload: url },
						// {label: 'Copy', payload: human + " " + url},
						{ label: intl.formatMessage({ id: 'features.EventView.components.EventViewContent.share' }), payload: { url, title: human } }
				]
				notes = true
				break

			case 'plan':
				contentItem = <EventViewContentPlan intl={intl} contentData={content.data} />
				meta_links = [
						{ label: intl.formatMessage({ id: 'features.EventView.components.EventViewContent.readPlan' }), payload: content.data.short_url },
						{ label: intl.formatMessage({ id: 'features.EventView.components.EventViewContent.share' }), payload: { url: content.data.short_url, title: content.data.title } }
				]
				break

			default:
				contentItem = <div className="content">{content.type}</div>
		}

		if (notes) {
			if (auth.isLoggedIn) {
				notes = (
					<div className="notes">
						<Textarea name='notes' onChange={::this.handleEditNote} placeholder={intl.formatMessage({ id: 'features.EventEdit.features.preview.notes.prompt' })} value={content.comment} />
					</div>
				)
			} else {
				notes = (
					<div className="notes unauthed">
						<FormattedHTMLMessage id="features.EventEdit.features.preview.notes.noAuthPrompt" values={{ url: 'https://www.bible.com/sign-in' }} />
					</div>
				)
			}
		}


		return (
			<div className={`type${meta_links ? '' : ' no-meta'}`}>
				{contentItem}
				{meta_links ? <EventViewContentMeta intl={intl} meta_links={meta_links.reverse()} /> : null}
				{notes}
			</div>
		)
	}
}

export default EventViewContent
