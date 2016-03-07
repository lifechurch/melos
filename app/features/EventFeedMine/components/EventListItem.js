import React, { Component, PropTypes } from 'react'
import Row from '../../../../app/components/Row'
import Column from '../../../../app/components/Column'
import { Link } from 'react-router'
import moment from 'moment'
import ActionCreators from '../actions/creators'

var Countdown = React.createClass({

	getInitialState: function() {
		const { initialCountdownSeconds } = this.props
		return { secondsRemaining: initialCountdownSeconds }
	},

	tick: function() {
		const { dispatch, index } = this.props
		const { secondsRemaining } = this.state
		this.setState({secondsRemaining: secondsRemaining - 1});
		if (secondsRemaining <= 0) {
			clearInterval(this.interval);

			// Simulate live
			dispatch(ActionCreators.setStatus(index, 2))
		}
	},

	componentDidMount: function() {
  		this.interval = setInterval(this.tick, 1000);
	},

	render: function() {
		const { secondsRemaining } = this.state
		const minutes = parseInt(secondsRemaining / 60)
		const seconds = parseInt(secondsRemaining % 60)
		const remainingTime =  (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds)
		return <span className="red-label">
			{remainingTime}
		</span>
	}
});

class EventListItem extends Component {

	getLiveDetails() {
		const { item, handleDuplicate } = this.props
		return (
			<div className="events-details">
				<span className="red-label">LIVE</span>
				<Link className="small-link" to={'#'} onClick={handleDuplicate.bind(this, item.id)}>Duplicate</Link>
				<Link className="small-link" to={`/event/edit/${item.id}/share`}>Share</Link>
			</div>
		)
	}

	getPublishedDetails() {
		const { dispatch, startOffset, item, index, handleDuplicate } = this.props
		const START_OFFSET_SECONDS = startOffset * 60;
		const start = moment(item.min_time);
		const end = moment(item.max_time);
		const secondsLeft = start.diff(moment(), "seconds");
		if (0 <= secondsLeft && secondsLeft <= START_OFFSET_SECONDS) {
			return <div className="events-details">
				<Countdown
					initialCountdownSeconds={secondsLeft}
					dispatch={dispatch}
					item={item}
					index={index} />
				<Link className="small-link" to={'#'} onClick={handleDuplicate.bind(this, item.id)}>Duplicate</Link>
				<Link className="small-link" to={`/event/edit/${item.id}/share`}>Share</Link>
			</div>
		}
		return <div className="events-details">
			<span className="details-text">
				{start.format("MMMM DD, YYYY") + " - " + end.format("MMMM DD, YYYY")}
			</span>
			<Link className="small-link" to={'#'} onClick={handleDuplicate.bind(this, item.id)}>Duplicate</Link>
		</div>
	}

	getDraftDetails() {
		const { item, handleDuplicate, handleDelete, index } = this.props
		return (
			<div className="events-details">
				<span className="gray-label">DRAFT</span>
				<Link className="small-link" to={'#'} onClick={handleDuplicate.bind(this, item.id)}>Duplicate</Link>
				<a className="small-link" onClick={handleDelete.bind(this, item.id, index)}>Delete</a>
			</div>
		)
	}

	getArchivedDetails() {
		const { item } = this.props
		var start = moment(item.min_time)
		var end = moment(item.max_time)
		return (
			<div className="events-details">
				<div className="details-text">
					{start.format("MMMM DD, YYYY") + " - " + end.format("MMMM DD, YYYY")}
				</div>
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
		const { item } = this.props
		var action
		if (item.status < 3) {
			action = <Link className="hollow-button gray action" to={'/event/edit/' + item.id}>Edit</Link>
		} else { // archived+
			action = <a className="hollow-button gray action" target="_blank" href={'https://www.bible.com/events/' + item.id}>View</a>
		}

		return (
			<li className="event-item" key={item.id}>
				<Row className="collapse">
					{action}
					{this.getEventImage(item)}
					<div className='details'>
						<Link className="title" to={`/event/edit/${item.id}`}>{item.title}</Link>
						{this.getDetails()}
					</div>
				</Row>
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
