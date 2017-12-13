import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import TopicComponent from '../features/Explore/components/TopicView'

class TopicView extends Component {
	// componentDidMount() {
	// 	const { moments, dispatch, routeParams, getTopic } = this.props
	// 	dispatch(exploreApi.actions.topic.get({ topic: routeParams && routeParams.topic }))
	// }

	render() {
		const { routeParams } = this.props

		return (
			<TopicComponent
				topic={routeParams && routeParams.topic}
			/>
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
