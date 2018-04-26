import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { fetchEventFeedDiscover } from '../actions'
import { Link } from 'react-router'
import Row from '../components/Row'
import ActionCreators from '../features/EventView/actions/creators'
import EventViewDetails from '../features/EventView/components/EventViewDetails'
import EventViewContent from '../features/EventView/components/EventViewContent'
import { injectIntl } from 'react-intl'

class EventView extends Component {
	componentWillMount() {
		const { dispatch, auth, event } = this.props
		if (auth.isLoggedIn) {
			dispatch(ActionCreators.savedEvents(event.item.id))
		}
	}

	render() {
		const { dispatch, auth, reference, event, intl } = this.props
		const { id, content } = event.item

		const contentList = content.map((c, i) => {
			return <EventViewContent intl={intl} key={i} id={id} content={c} index={i} dispatch={dispatch} auth={auth} reference={reference} />
		})

		return (
			<Row>
				<div id="ev-view" className="medium-10 large-7 columns small-centered">
					<Helmet title={`${this.props.event.item.title} :: ${intl.formatMessage({ id: 'containers.EventView.title' })}`} />
					<EventViewDetails intl={intl} {...this.props} />
					<div className="feed">
						{contentList}
					</div>
				</div>
			</Row>
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
		isSaved: false,
		item: {
			org_name: null,
			status: 'new',
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

export default connect(mapStateToProps, null)(injectIntl(EventView))
