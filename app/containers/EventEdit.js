import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { fetchEventFeedDiscover } from '../actions'
import { Link } from 'react-router'
import { fetchEventView } from '../actions'
import ActionCreators from '../features/EventEdit/features/details/actions/creators'
import EventHeader from '../components/EventHeader'

class EventEdit extends Component {
	handleDetailsNext(nextLocation) {
		const { dispatch, event } = this.props
		const { isDirty, detailsValid } = event
		if (isDirty) {
			if (detailsValid) {
				if (event.item.id) {
					dispatch(updateEvent(event.item))
				} else {
					dispatch(createEvent(event.item))
				}
			} else {
				// Didn't Pass Detail Validation
			}
		} else {
			// Isn't Dirty, just go next
		}
	}

	render() {
		const { children, event, loc, params, dispatch, modals, routing, references, plans, auth } = this.props
		return (
			<div>
				<Helmet title="Event" />
				<EventHeader {...this.props} />
				<div>
        	{children && React.cloneElement(children, { modals, event, loc, dispatch, params, routing, references, plans, auth, handleDetailsNext: ::this.handleDetailsNext })}
				</div>
			</div>
		)
	}
}

EventEdit.defaultProps = {
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

export default connect(mapStateToProps, null)(EventEdit)
