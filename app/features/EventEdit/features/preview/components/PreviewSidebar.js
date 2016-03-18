import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import { Link } from 'react-router'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import ActionCreators from '../actions/creators'
import { routeActions } from 'react-router-redux'

class PreviewSidebar extends Component {

	yvFormat(date) {
		return date.format('MMMM D, YYYY / h:mm A')
	}

	publishEvent() {
		const { dispatch, event } = this.props
		dispatch(ActionCreators.publishEvent({
			id: event.item.id
		})).then((response) => {
			const { errors } = response
			if (typeof errors === 'undefined') {
				dispatch(routeActions.push('/event/edit/' + event.item.id + '/share'))
			}
		}, (error) => {

		})
	}

	unpublishEvent() {
		const { dispatch, event } = this.props
		dispatch(ActionCreators.unpublishEvent({
			id: event.item.id
		})).then((response) => {
			const { errors } = response
			if (typeof errors === 'undefined') {
				dispatch(routeActions.push('/event/edit/' + event.item.id + '/content'))
			}
		}, (error) => {

		})
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
				publish_button = <a disabled={!event.rules.preview.canPublish || event.isFetching} className='solid-button green publish' onClick={::this.publishEvent}>Publish</a>
				break

			case 'published':
				publish_button = <a disabled={!event.rules.preview.canUnpublish || event.isFetching} className='solid-button gray publish' onClick={::this.unpublishEvent}>Unpublish</a>
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
					<h3>Discoverable:</h3>
					<h3 className="right">{earliest ? ::this.yvFormat(moment(earliest).subtract(5, 'days')) : null}</h3>
					<p>Your event will be visible in Bible App Event location and search results 5 days before your earliest start time.</p>
				</div>
				<div className='section'>
					<h3><span className="live">live</span> Status:</h3>
					<h3 className="right">{earliest ? ::this.yvFormat(moment(earliest).subtract(30, 'minutes')): null}</h3>
					<p>The red LIVE badge will display when your earliest start time begins.</p>
				</div>
				<div className='section'>
					<h3>Remove:</h3>
					<h3 className="right">{latest ? ::this.yvFormat(moment(latest)) : null}</h3>
					<p>Your Event will no longer be discoverable after its final end time. Attenders who tapped “Save Event” when your Event was discoverable will still have access to an archived version of it, This Event will also continue to be accessible through direct inbound links.</p>
				</div>
				{publish_button}
				<p className='publishMessage'>{event.publishMessage}</p>
				<p className='publishError'>{event.publishError}</p>
			</div>
		)
	}

}

PreviewSidebar.propTypes = {

}

export default PreviewSidebar
