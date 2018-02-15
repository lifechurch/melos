import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import TopicComponent from '../features/Explore/components/Topic'

function TopicView(props) {
	const { routeParams, location: { query } } = props

	return (
		<TopicComponent
			topic={routeParams && routeParams.topic}
			version_id={query && query.version}
		/>
	)
}

TopicView.propTypes = {
	routeParams: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
}

TopicView.defaultProps = {

}

function mapStateToProps(state) {
	return {
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(injectIntl(TopicView))
