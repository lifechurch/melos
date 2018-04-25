import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { fetchEventFeedSaved } from '../actions'
import { injectIntl, FormattedMessage } from 'react-intl'

class EventFeedSaved extends Component {
	componentWillMount() {
		const { dispatch } = this.props
		dispatch(fetchEventFeedSaved())
	}

	render() {

		const { intl } = this.props

		const errors = this.props.errors.map((error) => {
			return (<li>{error.key}</li>)
		})

		return (
			<div className="medium-10 large-7 columns small-centered">
				<Helmet title={intl.formatMessage({ id: 'containers.EventFeedSaved.title' })} />
				<h1 className="eventPageTitle"><FormattedMessage id="containers.EventFeedSaved.title" /></h1>
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

export default connect(mapStateToProps, null)(intjectIntl(EventFeedSaved))