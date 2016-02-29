import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import Row from '../components/Row'
import Column from '../components/Column'
import { Link } from 'react-router'
import CopyToClipboard from 'react-copy-to-clipboard'
import RevManifest from '../../rev-manifest.json'
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
		return (
			<div className="medium-10 large-4 columns small-centered">
				<Helmet title="Event Share" />
				<h1 className="sharePageTitle">Your Event is Now Published:</h1>
				<Row className="sharePageEventSection">
					<Column s="medium-4">
						{::this.getEventImage()}
				   	</Column>
				    	<Column s="medium-8">
						<Row>
					    		<Link className="title" to={"/events/" + eventItem.id}>
								{eventItem.title}
					    		</Link>
						</Row>
						<Row>
					    		<Link className="scheduledDates" to={"#"}>
					    			{::this.getDates()}
					    		</Link>
						</Row>
				    	</Column>
				</Row>
				<table className="sharePageTable">
					<tr>
						<td className="leftCell">
							<Link className="editButton" to={`/event/edit/${eventItem.id}`}><img src={`/images/${RevManifest['edit.png']}`} />Re-edit Event</Link>
						</td>
						<td>
					    		<Link className="myEventsButton" to={`/`}>Go to My Events</Link>
						</td>
				    	</tr>
				</table>
				<Row className="collapse">
				    	<Column s="large-3">
						<hr />
				    	</Column>
					<Column s="large-6">
						<h2 className="sharePageSubtitle">Share your event:</h2>
					</Column>
				    	<Column s="large-3">
						<hr />
				    	</Column>
				</Row>
				<div className="shareSection">
				    	<span className="shorturl">{"http://bible.com/events/" + (eventItem.id || "")}</span>
				    	<CopyToClipboard text={"http://bible.com/events/" + (eventItem.id || "")}>
						<a className="copyButton">Copy</a>
				    	</CopyToClipboard>
				</div>
				<div className="addthis_sharing_toolbox"></div>
				<hr />
			</div>
		)
	}
}

export default EventEditShare
