import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { fetchEventFeedSaved } from '../actions'

class EventFeedSaved extends Component {
	componentWillMount() {
		const { dispatch } = this.props
		dispatch(fetchEventFeedSaved())
	}

	render() {
		
		var errors = this.props.errors.map((error) => {
			return (<li>{error.key}</li>)
		})

		return (
			<div className="medium-10 large-7 columns small-centered">
				<Helmet title="Saved Events" />
				<h1 className="eventPageTitle">Saved Events</h1>
			</div>
		)
	}
}

EventFeedSaved.defaultProps = {
	hasError: false,
	errors: [], 
	isFetching: false,
	items: []
}
 
function mapStateToProps(state) {
	return state.eventFeeds.saved || {
		hasError: false,
		errors: [], 
		isFetching: false,
		items: []
	}
}

export default connect(mapStateToProps, null)(EventFeedSaved)