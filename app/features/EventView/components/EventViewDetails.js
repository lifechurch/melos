import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Row from '../../../components/Row'
import Column from '../../../components/Column'
import Image from '../../../components/Image'
import moment from 'moment'

class EventViewDetails extends Component {
	render() {
		const { event } = this.props
		const { org_name, title, images, description } = event.item

		return (
			<div className="details">
				<div className="org-bar">
					<div className="right"></div>
					<div className="timer"></div>
					<div className="org">{org_name}</div>
				</div>
				{ images ? <Image images={images} width={640} height={360} /> : null }
				<div className="title-bar">
					<div className="right"></div>
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
