import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Row from '../../../components/Row'
import Column from '../../../components/Column'
import Countdown from '../../../components/Countdown'
import { Link } from 'react-router'
import moment from 'moment'
import ActionCreators from '../actions/creators'
import { FormattedMessage } from 'react-intl'

class EventListItem extends Component {

	constructor(props) {
		super(props)

	}

	getLiveDetails() {
		const { dispatch, startOffset, item, index, handleDuplicate, params } = this.props
		const START_OFFSET_SECONDS = startOffset * 60;
		const start = moment(item.min_time);
		const secondsLeft = start.diff(moment(), 'seconds');

		return (
			<div className="events-details">
				<Countdown
					initialCountdownSeconds={secondsLeft}
					dispatch={dispatch}
					item={item}
					index={index}
				/>
				<a className="small-link" onClick={handleDuplicate.bind(this, item.id)}><FormattedMessage id="features.EventFeedMine.components.EventListItem.duplicate" /></a>
ƒ				<Link className="small-link" to={`/${params.locale}/event/edit/${item.id}/share`}><FormattedMessage id="features.EventFeedMine.components.EventListItem.share" /></Link>
			</div>
		)
	}

	getPublishedDetails() {
		const { item, handleDuplicate } = this.props
		const start = moment(item.min_time);
		const end = moment(item.max_time);

		return (
			<div className="events-details">
				<span className="details-text">
					{`${start.format('MMMM DD, YYYY')} - ${end.format('MMMM DD, YYYY')}`}
				</span>
				<a className="small-link" onClick={handleDuplicate.bind(this, item.id)}><FormattedMessage id="features.EventFeedMine.components.EventListItem.duplicate" /></a>
			</div>
		)
	}

	getDraftDetails() {
		const { item, handleDuplicate, handleDelete, index } = this.props
		return (
			<div className="events-details">
				<span className="gray-label"><FormattedMessage id="features.EventFeedMine.components.EventListItem.draft" /></span>
				<a className="small-link" onClick={handleDuplicate.bind(this, item.id)}><FormattedMessage id="features.EventFeedMine.components.EventListItem.duplicate" /></a>
				<a className="small-link" onClick={handleDelete.bind(this, item.id, index)}><FormattedMessage id="features.EventFeedMine.components.EventListItem.delete" /></a>
			</div>
		)
	}

	getArchivedDetails() {
		const { item, handleDuplicate } = this.props
		const start = moment(item.min_time)
		const end = moment(item.max_time)
		return (
			<div className="events-details">
				<span className="details-text">
					{`${start.format('MMMM DD, YYYY')} - ${end.format('MMMM DD, YYYY')}`}
				</span>
				<a className="small-link" onClick={handleDuplicate.bind(this, item.id)}><FormattedMessage id="features.EventFeedMine.components.EventListItem.duplicate" /></a>
			</div>
		)
	}

	getDetails() {
		const { item } = this.props
		switch (item.status) {
			case 0:
				return this.getDraftDetails();
			case 1:
				return this.getPublishedDetails()
			case 2:
				return this.getLiveDetails();
			case 3:
				return this.getArchivedDetails();
		}
	}

	getEventImage() {
		const { item } = this.props
		let imgUrl = null
		if (Array.isArray(item.images) && item.images.length > 0) {
			for (const i of item.images) {
				if (i.width == 320 && i.height == 180) {
					imgUrl = i.url
					break
				}
			}

			return <img className="thumbnail" src={imgUrl} />
		} else {
			return null
		}
	}

	render() {
		const { item, params } = this.props
		let action
		if (item.status < 3) {
			action = <Link className="hollow-button gray action" to={`/${params.locale}/event/edit/${item.id}`}><FormattedMessage id="features.EventFeedMine.components.EventListItem.edit" /></Link>
		} else { // archived+
			action = <a className="hollow-button gray action" target="_blank" href={`https://www.bible.com/events/${item.id}`}><FormattedMessage id="features.EventFeedMine.components.EventListItem.view" /></a>
		}

		return (
			<li className="event-item" key={item.id}>
				<Row className="collapse">
					{action}
					{this.getEventImage(item)}
					<div className='details'>
						<Link className="title" to={`/${params.locale}/event/edit/${item.id}`}>{item.title}</Link>
						{this.getDetails()}
					</div>
				</Row>
				{ item.hasError ? <div className='error-text'><FormattedMessage id="features.EventFeedMine.components.EventListItem.fail" /></div> : null }
			</li>
		)
	}
}

EventListItem.propTypes = {
	item: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	handleDuplicate: PropTypes.func.isRequired,
	index: PropTypes.number.isRequired,
	startOffset: PropTypes.number
}

export default EventListItem
