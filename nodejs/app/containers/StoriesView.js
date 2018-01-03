import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import StoriesList from '../features/Explore/components/StoriesList'

class TopicView extends Component {

	render() {
		const { routeParams } = this.props

		return (
			<StoriesList />
		)
	}
}

TopicView.propTypes = {
	routeParams: PropTypes.object.isRequired,
}

TopicView.defaultProps = {
	moments: null,
	bible: null,
	serverLanguageTag: 'en',
}

function mapStateToProps(state) {
	return {
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(injectIntl(TopicView))
