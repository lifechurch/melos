import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Row from '../components/Row'
import Column from '../components/Column'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import PreviewContainer from '../features/EventEdit/features/preview/components/PreviewContainer'
import { injectIntl, FormattedHTMLMessage } from 'react-intl'

class EventEditPreview extends Component {
	render() {
		const { dispatch, event, intl, params } = this.props
		return (
			<div>
				<Helmet title={intl.formatMessage({ id: 'containers.EventEditPreview.title' })} />
				<PreviewContainer {...this.props} />
				<Row>
					<Column s='medium-6'>
						<Link disabled={!event.rules.content.canView} to={`/${params.locale}/event/edit/${event.item.id}/content`}><FormattedHTMLMessage id="containers.EventEditPreview.previous" /></Link>
					</Column>
					<Column s='medium-6' a='right' />
				</Row>
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
			status: 'new',
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

export default connect(mapStateToProps, null)(injectIntl(EventEditPreview))
