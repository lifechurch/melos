import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { fetchEventFeedDiscover } from '../actions'
import { Link } from 'react-router'
import { fetchEventView } from '../actions'
import EventHeader from '../components/EventHeader'

class EventEdit extends Component {
	componentWillMount() {
		const { dispatch, params } = this.props
		if (params.hasOwnProperty("id") && params.id > 0) {
			dispatch(fetchEventView(params.id))
		}
	}

	render() {
		const { children, event, params, dispatch } = this.props
		return (
			<div>
				<Helmet title="Event" />
				<EventHeader {...this.props} /> 
				<div>
        	{children && React.cloneElement(children, { event, dispatch })}
				</div>
			</div>
		)
	}
}

EventEdit.defaultProps = {
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
			image: [],
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
		event: state.event
	}
}

export default connect(mapStateToProps, null)(EventEdit)