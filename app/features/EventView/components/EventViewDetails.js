import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Row from '../../../components/Row'
import Column from '../../../components/Column'
import Image from '../../../components/Image'
import ActionCreators from '../actions/creators'
import moment from 'moment'

class EventViewDetails extends Component {
	saveEvent() {
		const { dispatch, event } = this.props
		dispatch(ActionCreators.saveNote({id: event.item.id}))
	}

	toggleLocations(e) {
		e.target.nextSibling.classList.toggle('show')
		// e.target.text = e.target.text=='expand' ? 'collapse' : 'expand'
	}

	render() {
		const { event } = this.props
		const { org_name, title, images, description, locations } = event.item

		var action = <div className="right"><a onClick={::this.saveEvent} className="solid-button green">Save Event</a></div>
		if (event.isSaved) {
			var action = <div className="right"><a className="solid-button gray">Event Saved</a></div>
		}

		var locationList = Object.keys(locations).map((l) => {
			return (
				<li key={l}>
					<div className="location"><b>{locations[l].name}</b> {locations[l].formatted_address}</div>
					<div className="times">Start time(s): {locations[l].times.map((t) => {return moment(t.start_dt).format('dddd h:mm A')}).join(', ')}</div>
				</li>
			)
		})

		return (
			<div className="details">
				<div className="org-bar">
					<div className="right"><a className="share-icon">O</a></div>
					<div className="timer"></div>
					<div className="org">{org_name}</div>
				</div>
				{ images ? <Image className="hero" images={images} width={640} height={360} /> : null }
				<div className="title-bar">
					{action}
					<div className="title">{title}</div>
				</div>
				<div className="desc">{description}</div>
				<a class="locations-toggle" onClick={this.toggleLocations}>Locations & Times</a>
				<ul className={"locations" + ((Object.keys(locations).length < 3) ? " show" : "")}>{locationList}</ul>
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
