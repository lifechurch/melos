import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import { Link } from 'react-router'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import ActionCreators from '../actions/creators'

class PreviewSidebar extends Component {

	yvFormat(date) {
		return date.format('MMMM D, YYYY / h:mm A')
	}

	publishEvent() {
		const { dispatch, event } = this.props
		dispatch(ActionCreators.publishEvent({
			id: event.item.id
		}))
	}

	unpublishEvent() {
		const { dispatch, event } = this.props
		dispatch(ActionCreators.unpublishEvent({
			id: event.item.id
		}))
	}

	render() {
		const { event } = this.props
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
				publish_button = <Link disabled={!event.rules.preview.canPublish} className='solid-button green publish' onClick={::this.publishEvent} to={`/event/edit/${event.item.id}/share`}>Publish</Link>
				break

			case 'published':
				publish_button = <Link disabled={!event.rules.preview.canUnpublish} className='solid-button gray publish' onClick={::this.unpublishEvent} to={`/event/edit/${event.item.id}/content`}>Unpublish</Link>
				break

			default:
				publish_button = <a className="solid-button gray publish" disabled={true}>{event.item.status}</a>
				break
		}

		return (
			<div className='sidebar'>
				<div className='section'>
					<h3>Locations:</h3>
					<h3 className="right">{location_count}</h3>
				</div>
				<div className='section'>
					<h3>Visible:</h3>
					<h3 className="right">{earliest ? ::this.yvFormat(moment(earliest).subtract(5, 'days')) : null}</h3>
					<p>Your event will be visible in Bible App Event location and search results 5 days before your earliest start time.</p>
				</div>
				<div className='section'>
					<h3><span className="live">live</span> Status:</h3>
					<h3 className="right">{earliest ? ::this.yvFormat(moment(earliest).subtract(30, 'minutes')): null}</h3>
					<p>The red LIVE badge will display 30 minutes before your earliest start time.</p>
				</div>
				<div className='section'>
					<h3>Remove:</h3>
					<h3 className="right">{latest ? ::this.yvFormat(moment(latest)) : null}</h3>
					<p>Your event will be removed from the Bible App after your last event ends. Attenders who tap "Save Event" will continue to have access to an archived version of this Event.</p>
				</div>
				{publish_button}
				<p className='publishMessage'>{event.publishMessage}</p>
			</div>
		)
	}

}

PreviewSidebar.propTypes = {

}

export default PreviewSidebar
