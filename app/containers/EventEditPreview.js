import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Row from '../components/Row'
import Column from '../components/Column'
import Helmet from 'react-helmet'
import PreviewContainer from '../features/EventEdit/features/preview/components/PreviewContainer'

class EventEditPreview extends Component {
	render() {
		const { dispatch, event } = this.props
		return (
			<div>
				<Helmet title="Event Preview" />
				<PreviewContainer {...this.props} />
			</div>
		)
	}
}

EventEditPreview.defaultProps = {
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
			locations: null,
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

export default connect(mapStateToProps, null)(EventEditPreview)
