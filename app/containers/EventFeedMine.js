import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { fetchEventFeedMine } from '../actions'
import { Link } from 'react-router'
import Row from '../components/Row'
import Column from '../components/Column'

class EventFeedMine extends Component {
	componentWillMount() {
		const { dispatch } = this.props
		dispatch(fetchEventFeedMine())
	}
    
    getLiveDetails(item) {
        return (
            <div className="events-details">
                <span className="red-label">LIVE</span>
                <Link className="small-link" to={`/event/edit/${item.id}`}>Edit</Link>
                <Link className="small-link" to={'#'}>Share</Link>
            </div>
        )
    }

    getPublishedWithCountdownDetails(item) {
        return (
            <div className="events-details">
                <span className="red-label">29.95</span>
                <Link className="small-link" to={`/event/edit/${item.id}`}>Edit</Link>
                <Link className="small-link" to={'#'}>Share</Link>
            </div>
        )
    }

    getPublishedDetails(item) {
        return (
            <div className="events-details">
                <span className="details-text">October 17 - 18, 2015</span>
                <Link className="small-link" to={`/event/edit/${item.id}`}>Edit</Link>
            </div>
        )
    }

    getDraftDetails(item) {
        return (
            <div className="events-details">
                <span className="gray-label">DRAFT</span>
                <Link className="small-link" to={`/event/edit/${item.id}`}>Edit</Link>
                <Link className="small-delete-link" to={'#'}>Delete</Link>
            </div>
        )
    }

    getArchivedDetails(item) {
        return (
            <div className="events-details">
                <div className="details-text">October 17 - 18, 2015</div>
                <div className="details-text">2,434 Views / 1,889 Joins</div>
            </div>
        )
    }

    // Todo: Need to create enum for the event statuses
    getDetails(item) {
        switch (item.status) {
            case 0:
                return this.getDraftDetails(item);
            case 1:
                // Todo: Determine whether countdown/regular published
                return this.getPublishedDetails(item);
            case 2:
                return this.getArchivedDetails(item);
            case 3:
                return this.getLiveDetails(item);
        }
    }

    getEventImage(image_id) {
        if (image_id != null) {
            // Todo: return image
            // return <img src="" className="event-thumbnail" />
        }
    }
	
    render() {
		const { hasError, errors, isFetching, items } = this.props
		var itemList = items.map((item) => {
            return (
                <li className="eventPageListItem" key={item.id}>
                        <Row className="collapse">
                            <Column s='medium-2'>
                                {this.getEventImage(item.image_id)}
                            </Column>
                            <Column s='medium-8'>
                                <Row>
                                    <Link className="large-link" to={`/event/edit/${item.id}`}>{item.title}</Link>
                                </Row>
                                <Row>
                                    {this.getDetails(item)}
                                </Row>
                            </Column>
                            <Column s='medium-2' a='right'>
                                <Link className="hollow-button gray" to="#">Duplicate</Link>
                            </Column>
                        </Row>
                </li>
            )
		})

		return (
			<div className="medium-10 large-7 columns small-centered">
				<Helmet title="My Events" />
                <div className="event-header">
                    <Row className="collapse">
                        <Column s='medium-4'>
                            <span className="yv-title">YouVersion</span>
                        </Column>
                        <Column s='medium-4' a='center'>
                            EVENT BUILDER 
                        </Column>
                        <Column s='medium-4' a='right'>
                            First Lastname 
                        </Column>
                    </Row>
                </div>
                <div className="event-title-section">
                    <h1 className="title">My Events</h1>
                    <Link className="solid-button green" to="/event/edit">Create New Event</Link>
                    <h2 className="subtitle">EVENTS | CREATED</h2> 
                </div>
                <ul className="unindented">
                    {itemList}
                </ul>				
			</div>
		)
	}
}

EventFeedMine.defaultProps = {
	hasError: false,
	errors: [], 
	isFetching: false,
	items: []
}
 
function mapStateToProps(state) {
	return state.eventFeeds.mine || {
		hasError: false,
		errors: [], 
		isFetching: false,
		items: []
	}
}

export default connect(mapStateToProps, null)(EventFeedMine)
