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

	render() {
		const { event } = this.props
		const { org_name, title, images, description } = event.item

		var action = <div className="right"><a onClick={::this.saveEvent} className="solid-button green">Save Event</a></div>
		if (event.isSaved) {
			var action = <div className="right"><a className="solid-button gray">Event Saved</a></div>
		}

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
				<div className="locs"><a href="#">Locations & Times</a></div>
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
