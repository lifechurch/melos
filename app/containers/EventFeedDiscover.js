import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { fetchEventFeedDiscover } from '../actions'
import { Link } from 'react-router'

class EventFeedDiscover extends Component {
	componentWillMount() {
		const { dispatch } = this.props
		dispatch(fetchEventFeedDiscover())
	}

	render() {
		const { hasError, errors, isFetching, items } = this.props
		
		var itemList = items.map((item) => {
			return (
				<li><Link to={`/event/edit/${item.id}`}>{item.title}</Link></li>
			)
		})

		return (
			<div className="medium-10 large-7 columns small-centered">
				<Helmet title="Discover Events" />
				<h1 className="eventPageTitle">Discover</h1>
				<ul>
					{itemList}
				</ul>
			</div>
		)
	}
}

EventFeedDiscover.defaultProps = {
	hasError: false,
	errors: [], 
	isFetching: false,
	items: []
}
 
function mapStateToProps(state) {
	return state.eventFeeds.discover || {
		hasError: false,
		errors: [], 
		isFetching: false,
		items: []
	}
}

export default connect(mapStateToProps, null)(EventFeedDiscover)