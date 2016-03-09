import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Row from '../../../components/Row'
import Column from '../../../components/Column'
import moment from 'moment'
import EventViewContentMeta from './EventViewContentMeta'
import EventViewContentText from './EventViewContentText'
import EventViewContentLink from './EventViewContentLink'
import EventViewContentImage from './EventViewContentImage'
import EventViewContentPlan from './EventViewContentPlan'
import EventViewContentReference from './EventViewContentReference'

class EventViewContent extends Component {
	render() {
		const { dispatch, reference, content, index } = this.props
		var contentItem, meta_links = [{label: 'Share', url: 'http://#'}]
		var notes = <div className="notes"><input placeholder="Add your private notes…" /></div>

		switch (content.type) {
				case 'text':
					contentItem = <EventViewContentText contentData={content.data} meta_links={meta_links} />
					meta_links = [
						{label: 'Copy', url: 'http://#'},
						{label: 'Share', url: 'http://#'}
					]
					break

				case 'url':
					contentItem = <EventViewContentLink contentData={content.data} />
					notes = false
					break

				case 'image':
					contentItem = <EventViewContentImage contentData={content.data} />
					notes = false
					break

				case 'reference':
					contentItem = <EventViewContentReference contentData={content.data} contentIndex={index} dispatch={dispatch} reference={reference} />
					notes = false
					break

				case 'plan':
					contentItem = <EventViewContentPlan contentData={content.data} />
					meta_links = [
						{label: 'Read Plan', url: content.data.short_url},
						{label: 'Share', url: 'http://#'}
					]
					notes = false
					break

				default:
					contentItem = <div className="content">{content.type}</div>
					meta_links = [
						{label: 'Read', url: 'http://#'},
						{label: 'Copy', url: 'http://#'},
						{label: 'Share', url: 'http://#'}
					]
		}

		return (
			<div className="type">
				{contentItem}
				<EventViewContentMeta meta_links={meta_links} />
				{notes}
			</div>
		)
	}
}

export default EventViewContent
