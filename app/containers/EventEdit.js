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

	handleDetailsNext(nextLocation) {
		const { dispatch, event } = this.props
		const { isDirty, detailsValid } = event
		console.group("Route will leave...")
		if (isDirty) {
			console.log("dirty")			
			if (detailsValid) {
				console.log("details valid")
				if (event.item.id) {
					console.log("update")
					dispatch(updateEvent(event.item))
				} else {
					console.log("create")
					dispatch(createEvent(event.item))
				}
			} else {
				console.log("validation failed")
				// Didn't Pass Detail Validation
			}
		} else {
			console.log("not dirty")
			// Isn't Dirty, just go next
		}
		console.groupEnd()
	}	

	render() {
		const { children, event, loc, params, dispatch, modals } = this.props
		return (
			<div>
				<Helmet title="Event" />
				<EventHeader {...this.props} /> 
				<div>
        	{children && React.cloneElement(children, { modals, event, loc, dispatch, params, handleDetailsNext: ::this.handleDetailsNext })}
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
		event: state.event,
		modals: state.modals,
		loc: state.loc
	}
}

export default connect(mapStateToProps, null)(EventEdit)