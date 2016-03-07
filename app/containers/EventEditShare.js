import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import Row from '../components/Row'
import Column from '../components/Column'
import { Link } from 'react-router'
import CopyToClipboard from 'react-copy-to-clipboard'
import RevManifest from '../../app/lib/revManifest'
import moment from 'moment'

class EventEditShare extends Component {

	getEventImage() {
		const { item } = this.props.event
		if (Array.isArray(item.images) && item.images.length) {
			for (let img of item.images) {
				if (img.width == 320 && img.height == 180) {
					return <img className="thumbnail" src={img.url} />
				}
			}
		}
		return null
	}

	getDates() {
		const locations = this.props.event.item.locations;
		if (locations) {
			var start = null;
			var end = null;
			for (let id in locations) {
				for (let range of locations[id].times) {
					var rangeStart = new Date(range['start_dt'])
					var rangeEnd = new Date(range['end_dt'])
					if (!start || rangeStart < start) {
						start = rangeStart
					}
					if (!end || rangeEnd > end) {
						end = rangeEnd
					}
				}
			}
			if (start && end) {
				var startDate = moment(start)
				var endDate = moment(end)
				return startDate.format("MMMM DD, YYYY") + " - " + endDate.format("MMMM DD, YYYY")
			}
		}
		return "";
	}

	render() {
    const eventItem = this.props.event.item
		var interval = setInterval(function() {
			if (typeof window != 'undefined' && window.addthis) {
				clearInterval(interval);
				window.addthis.layers.refresh()
			}
		}, 100);
		var image = ::this.getEventImage()
		return (
			<div className="medium-6 columns small-centered share">
				<Helmet title="Event Share" />
				<div className="page-title">Your Event is Now Published:</div>
				<div className="event">
					{image}
		    		<Link className={image ? "title" : "title center"} to={"http://bible.com/events/" + eventItem.id} target="_blank">{eventItem.title}</Link>
		    		<a className={image ? "dates" : "dates center"}>{::this.getDates()}</a>
				</div>
				<div className="actions">
					<Link className="edit" to={`/event/edit/${eventItem.id}`}><img src={`/images/${RevManifest('edit.png')}`} />Re-edit Event</Link>
					<Link className="my-events" to={`/`}>Go to My Events</Link>
				</div>
				<div className="page-subtitle"><span>Share your event:</span></div>
				<div className="details">
			    	<Link className="shorturl" to={"http://bible.com/events/" + eventItem.id} target="_blank">{"http://bible.com/events/" + eventItem.id}</Link>
			    	<CopyToClipboard text={"http://bible.com/events/" + eventItem.id}>
					<a className="copy">Copy</a>
			    	</CopyToClipboard>
				</div>
				<div className="addthis_sharing_toolbox"></div>
				<hr />
			</div>
		)
	}
}

export default EventEditShare
