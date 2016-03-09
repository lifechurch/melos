import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { fetchEventFeedDiscover } from '../actions'
import { Link } from 'react-router'
import EventViewDetails from '../features/EventView/components/EventViewDetails'
import EventViewFeed from '../features/EventView/components/EventViewFeed'

class EventView extends Component {
	componentWillMount() {
	}

	render() {
		return (
			<div id="ev-view">
				<Helmet title={this.props.event.item.title + " :: YouVersion Event"} />
				<EventViewDetails {...this.props} />
				<EventViewFeed {...this.props} />
			</div>
		)
	}
}

EventView.defaultProps = {
	modals: {},
	event: {
		hasError: false,
		errors: [],
		isFetching: false,
		detailsValid: false,
		isDirty: true,
		isSaving: false,
		item: {
			org_name: null,
			status: "new",
			updated_dt: null,
			description: null,
			title: null,
			image_id: null,
			images: null,
			locations: {},
			content: [],
			created_dt: null,
			id: null,
			owner_id: null /* Current User Id */
		}
	}
}

function mapStateToProps(state) {
	return {
		auth: state.auth,
		event: state.event,
		modals: state.modals,
		loc: state.loc,
		routing: state.routing,
		references: state.references,
		plans: state.plans
	}
}

export default connect(mapStateToProps, null)(EventView)
