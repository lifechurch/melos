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
import EventViewContentAnnouncement from './EventViewContentAnnouncement'

class EventViewContent extends Component {
	render() {
		const { dispatch, reference, content, index } = this.props
		var contentItem, meta_links, notes

		switch (content.type) {
				case 'text':
					contentItem = <EventViewContentText contentData={content.data} meta_links={meta_links} />
					meta_links = [
						{label: 'Copy', url: 'http://#'},
						{label: 'Share', url: 'http://#'}
					]
					notes = true
					break

				case 'url':
					contentItem = <EventViewContentLink contentData={content.data} />
					break

				case 'announcement':
					contentItem = <EventViewContentAnnouncement contentData={content.data} />
					break

				case 'image':
					contentItem = <EventViewContentImage contentData={content.data} />
					meta_links = [{label: 'Share', url: 'http://#'}]
					notes = true
					break

				case 'reference':
					var usfmLink = 'https://www.bible.com/bible/' + content.data.version_id + '/' +
								   content.data.usfm[0].split('.').slice(0,2).join('.') + '.' +
								   content.data.usfm.map((u) => { return u.split('.')[2] }).join()

					contentItem = <EventViewContentReference contentData={content.data} contentIndex={index} dispatch={dispatch} reference={reference} />
					meta_links = [
						{label: 'Read', url: usfmLink},
						{label: 'Copy', url: 'http://#'},
						{label: 'Share', url: 'http://#'}
					]
					notes = true
					break

				case 'plan':
					contentItem = <EventViewContentPlan contentData={content.data} />
					meta_links = [
						{label: 'Read Plan', url: content.data.short_url},
						{label: 'Share', url: 'http://#'}
					]
					break

				default:
					contentItem = <div className="content">{content.type}</div>
		}

		return (
			<div className={"type" + (meta_links ? "" : " no-meta")}>
				{contentItem}
				{meta_links ? <EventViewContentMeta meta_links={meta_links} /> : null}
				{notes ? <div className="notes"><input placeholder="Add your private notes…" /></div> : null}
			</div>
		)
	}
}

export default EventViewContent
