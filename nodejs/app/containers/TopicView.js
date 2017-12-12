import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import moment from 'moment'
import Helmet from 'react-helmet'
import exploreApi from '@youversion/api-redux/lib/endpoints/explore'
import Card from '@youversion/melos/dist/components/containers/Card'
import Heading1 from '@youversion/melos/dist/components/typography/Heading1'
import Heading2 from '@youversion/melos/dist/components/typography/Heading2'
import TopicList from '../features/Explore/TopicList'
import ShareSheet from '../widgets/ShareSheet/ShareSheet'
import TopicComponent from '../features/Explore/TopicView'

class TopicView extends Component {
	// componentDidMount() {
	// 	const { moments, dispatch, routeParams, getTopic } = this.props
	// 	dispatch(exploreApi.actions.topic.get({ topic: routeParams && routeParams.topic }))
	// }

	render() {
		const { routeParams, moments, bible, intl, hosts, serverLanguageTag } = this.props


		return (
			<div>
				<TopicComponent
					topic={routeParams && routeParams.topic}
				/>
			</div>
		)
	}
}

TopicView.propTypes = {
	moments: PropTypes.object,
	routeParams: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string,
	bible: PropTypes.object,
	intl: PropTypes.object.isRequired,
	hosts: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
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
