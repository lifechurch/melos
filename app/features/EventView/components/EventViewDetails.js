import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Row from '../../../components/Row'
import Column from '../../../components/Column'
import Image from '../../../components/Image'
import ActionCreators from '../actions/creators'
import moment from 'moment'
import RevManifest from '../../../lib/revManifest'

class EventViewDetails extends Component {
	saveEvent() {
		const { dispatch, event } = this.props
		dispatch(ActionCreators.saveNote({id: event.item.id}))
	}

	toggleLocations(e) {
		var loc = e.currentTarget.childNodes
		loc[1].text = loc[1].text=='expand' ? 'collapse' : 'expand'
		loc[2].classList.toggle('show')
	}

	handleShare() {
		// http://www.addthis.com/academy/what-is-address-bar-sharing-analytics/
		var addthis_config = addthis_config||{}
		addthis_config.data_track_addressbar = false

		e.target.nextSibling.classList.toggle('show')
	}

	render() {
		const { event } = this.props
		const { org_name, title, images, description, locations } = event.item

		var action = <div className="right"><a onClick={::this.saveEvent} className="solid-button green">Save Event</a></div>
		if (event.isSaved) {
			var action = <div className="right"><a className="solid-button gray">Event Saved</a></div>
		}

		var locationList = Object.keys(locations).map((l) => {
			var name = locations[l].name ? <div className='location name'>{locations[l].name}</div> : null
			var address = <div className='location address'>{locations[l].formatted_address}</div>
			return (
				<li key={l}>
					{name}
					{address}
					<div className="times">{locations[l].times.map((t) => {return moment(t.start_dt).format('dddd h:mm A')}).join(', ')}</div>
				</li>
			)
		})

		return (
			<div className="details">
				<div className="org-bar">
					<div className="right">
						<a className="share-icon" onClick={::this.handleShare}><img src={`/images/${RevManifest('share.png')}`} /></a>
						<div className="addthis_sharing_toolbox" data-url={event.item.short_url} data-title={event.item.title}></div>
					</div>
					<div className="org">{org_name}</div>
				</div>
				{ images ? <Image className="hero" images={images} width={640} height={360} /> : null }
				<div className="title-bar">
					{action}
					<div className="title">{title}</div>
				</div>
				<div className="desc">{description}</div>
				<div className="type no-meta">
					<div className="content locations" onClick={this.toggleLocations}>
						<div className='title left'>Locations & Times</div>
						<a ref="toggle" className='toggle right'>expand</a>
						<div className="caption">
							<ul>{locationList}</ul>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

EventViewDetails.propTypes = {
	// item: PropTypes.object.isRequired,
	// dispatch: PropTypes.func.isRequired,
	// handleDuplicate: PropTypes.func.isRequired,
	// index: PropTypes.number.isRequired,
	// startOffset: PropTypes.number
}

export default EventViewDetails
