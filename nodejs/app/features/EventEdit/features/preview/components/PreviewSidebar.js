import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import { Link } from 'react-router'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import ActionCreators from '../actions/creators'
import { routeActions } from 'react-router-redux'
import { FormattedMessage } from 'react-intl'

class PreviewSidebar extends Component {

	constructor(props) {
		super(props)

	}

	yvFormat(date) {
		return date.format('MMMM D, YYYY / h:mm A')
	}

	publishEvent() {
		const { dispatch, event, params } = this.props
		dispatch(ActionCreators.publishEvent({
			id: event.item.id
		})).then((response) => {
			const { errors } = response
			if (typeof errors === 'undefined') {
				dispatch(routeActions.push('/' + params.locale + '/event/edit/' + event.item.id + '/share'))
			}
		}, (error) => {

		})
	}

	unpublishEvent() {
		const { dispatch, event, params } = this.props
		dispatch(ActionCreators.unpublishEvent({
			id: event.item.id
		})).then((response) => {
			const { errors } = response
			if (typeof errors === 'undefined') {
				dispatch(routeActions.push('/' + params.locale + '/event/edit/' + event.item.id + '/content'))
			}
		}, (error) => {

		})
	}

	render() {
		const { event, intl } = this.props
		const { locations } = event.item
		var location_count = 0
		if (event.item.locations) {
			location_count = Object.keys(event.item.locations).filter((k) => {
				return event.item.locations[k].isSelected
			}).length
		}

		var times = locations ? Object.keys(locations).map((i)=>{ return locations[i].times }) : []
		times = times.concat.apply([],times) // flatten times
		var earliest = times.map((i)=>{ return new Date(i.start_dt) })
		var latest = times.map((i)=>{ return new Date(i.end_dt) })
		earliest = earliest.length > 0 ? new Date(Math.min.apply(null, earliest)) : null
		latest = latest.length > 0 ? new Date(Math.max.apply(null, latest)) : null

		var publish_button = null
		switch (event.item.status) {
			case 'draft':
				publish_button = <a disabled={!event.rules.preview.canPublish || event.isFetching} className='solid-button green publish' onClick={::this.publishEvent}><FormattedMessage id="features.EventEdit.features.preview.components.PreviewFeed.publish" /></a>
				break

			case 'published':
				publish_button = <a disabled={!event.rules.preview.canUnpublish || event.isFetching} className='solid-button gray publish' onClick={::this.unpublishEvent}><FormattedMessage id="features.EventEdit.features.preview.components.PreviewFeed.unpublish" /></a>
				break

			default:
				publish_button = <a className="solid-button gray publish" disabled={true}>{intl.formatMessage({id:"components.EventHeader.status." + event.item.status.toLowerCase()})}</a>
				break
		}

		const eventUrlDomain = typeof window !== 'undefined' ? ( window.__ENV__ === 'staging' ? 'staging.bible.com' : 'bible.com' ) : 'bible.com'

		return (
			<div className='sidebar'>
				<div className='section section-title'>
					<FormattedMessage tagName="h3" id="features.EventEdit.features.preview.components.PreviewFeed.review" />
				</div>
				<div className='section'>
					<FormattedMessage tagName="h3" id="features.EventEdit.features.preview.components.PreviewFeed.previewUrl" />
					<h3 className="right"><a target="_blank" href={`https://${eventUrlDomain}/events/${event.item.id}`}>https://{eventUrlDomain}/events/{event.item.id}</a></h3>
				</div>
				<div className='section'>
					<FormattedMessage tagName="h3" id="features.EventEdit.features.preview.components.PreviewFeed.locations" />
					<h3 className="right">{location_count}</h3>
				</div>
				<div className='section'>
					<FormattedMessage tagName="h3" id="features.EventEdit.features.preview.components.PreviewFeed.discoverable.title" />
					<h3 className="right">{earliest ? ::this.yvFormat(moment(earliest).subtract(5, 'days')) : null}</h3>
					<FormattedMessage tagName="p"  id="features.EventEdit.features.preview.components.PreviewFeed.discoverable.desc" />
				</div>
				<div className='section'>
					<h3><span className="live"><FormattedMessage id="components.EventHeader.status.live" /></span> <FormattedMessage id="features.EventEdit.features.preview.components.PreviewFeed.status.title" /></h3>
					<h3 className="right">{earliest ? ::this.yvFormat(moment(earliest).subtract(30, 'minutes')): null}</h3>
					<FormattedMessage tagName="p"  id="features.EventEdit.features.preview.components.PreviewFeed.status.desc" />
				</div>
				<div className='section'>
					<FormattedMessage tagName="h3" id="features.EventEdit.features.preview.components.PreviewFeed.remove.title" />
					<h3 className="right">{latest ? ::this.yvFormat(moment(latest)) : null}</h3>
					<FormattedMessage tagName="p"  id="features.EventEdit.features.preview.components.PreviewFeed.remove.desc" />
				</div>
				{publish_button}
				{ event.publishMessage ? (<p className='publishMessage'>{intl.formatMessage({id:event.publishMessage})}</p>) : null }
				{ event.publishError ? (<p className='publishError'>{intl.formatMessage({id:event.publishError})}</p>) : null }
			</div>
		)
	}

}

PreviewSidebar.propTypes = {

}

export default PreviewSidebar
