import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { fetchEventFeedDiscover } from '../actions'
import { Link } from 'react-router'
import { injectIntl, FormattedMessage } from 'react-intl'

class EventFeedDiscover extends Component {
	componentWillMount() {
		const { dispatch } = this.props
		dispatch(fetchEventFeedDiscover())
	}

	render() {
		const { hasError, errors, isFetching, items, intl, params } = this.props

		const itemList = items.map((item) => {
			return (
				<li><Link to={`/${params.locale}/event/edit/${item.id}`}>{item.title}</Link></li>
			)
		})

		return (
			<div className="medium-10 large-7 columns small-centered">
				<Helmet title={intl.formatMessage({ id: 'containers.EventFeedDiscover.title' })} />
				<h1 className="eventPageTitle"><FormattedMessage id="containers.EventFeedDiscover.discover" /></h1>
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

export default connect(mapStateToProps, null)(injectIntl(EventFeedDiscover))