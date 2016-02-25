import React, { Component, PropTypes } from 'react'
import Row from '../../../../app/components/Row'
import Column from '../../../../app/components/Column'
import { Link } from 'react-router'

class EventListItem extends Component {
	getLiveDetails(item, handleDuplicate) {
		return (
			<div className="events-details">
				<span className="red-label">LIVE</span>
				<Link className="small-link" to={'#'} onClick={handleDuplicate.bind(this, item.id)}>Duplicate</Link>
				<Link className="small-link" to={'#'}>Share</Link>
			</div>
		)
	}

	getPublishedWithCountdownDetails(item, handleDuplicate) {
		return (
			<div className="events-details">
				<span className="red-label">29.95</span>
				<Link className="small-link" to={'#'} onClick={handleDuplicate.bind(this, item.id)}>Duplicate</Link>
				<Link className="small-link" to={'#'}>Share</Link>
			</div>
		)
	}

	getPublishedDetails(item, handleDuplicate) {
		return (
			<div className="events-details">
				<span className="details-text">October 17 - 18, 2015</span>
				<Link className="small-link" to={'#'} onClick={handleDuplicate.bind(this, item.id)}>Duplicate</Link>
			</div>
		)
	}

	getDraftDetails(item, handleDuplicate) {
		//<Link className="small-delete-link" to={'#'}>Delete</Link>
		return (
			<div className="events-details">
				<span className="gray-label">DRAFT</span>
				<Link className="small-link" to={'#'} onClick={handleDuplicate.bind(this, item.id)}>Duplicate</Link>
			</div>
		)
	}

	getArchivedDetails(item, handleDuplicate) {
		return (
			<div className="events-details">
				<div className="details-text">October 17 - 18, 2015</div>
				<div className="details-text">2,434 Views / 1,889 Joins</div>
			</div>
		)
	}

	// Todo: Need to create enum for the event statuses
	getDetails(item, handleDuplicate) {
		switch (item.status) {
			case 0:
				return this.getDraftDetails(item, handleDuplicate);
			case 1:
				// Todo: Determine whether countdown/regular published
				return this.getPublishedDetails(item, handleDuplicate);
			case 2:
				return this.getArchivedDetails(item, handleDuplicate);
			case 3:
				return this.getLiveDetails(item, handleDuplicate);
		}
	}

	getEventImage(item) {
		let imgUrl = null
		if (Array.isArray(item.image) && item.image.length > 0) {
			for (const i of item.image) {
				if (i.width == 320 && i.height == 180) {
					imgUrl = i.url
					break
				}
			}

			return (<img src={imgUrl} />)
		} else {
			return null
		}
	}

	render() {
		const { item, handleDuplicate } = this.props
		return (
			<li className="eventPageListItem" key={item.id}>
				<Row className="collapse">
					<Column s='medium-2'>
						{this.getEventImage(item)}
					</Column>
					<Column s='medium-8'>
						<Row>
							<Link className="large-link" to={`/event/edit/${item.id}`}>{item.title}</Link>
						</Row>
						<Row>
							{this.getDetails(item, handleDuplicate)}
						</Row>
					</Column>
					<Column s='medium-2' a='right'>
						<a className="hollow-button gray" to={`/event/edit/${item.id}`}>Edit</a>
					</Column>
				</Row>
			</li>
		)
	}
}

EventListItem.propTypes = {
	item: PropTypes.object.isRequired,
	handleDuplicate: PropTypes.func.isRequired
}

export default EventListItem
