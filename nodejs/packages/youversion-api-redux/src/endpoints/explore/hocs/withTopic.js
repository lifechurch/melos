import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import exploreApi from '../index'
import getExploreModel from '../../../models/explore'

/**
 * HOC which passes down usfmsForTopic as well as the explore data model
 * topic must be passed, i.e. <WrappedComponent topic='grace' />
 * @param  {React.Component} WrappedComponent [component to extend/pass props to]
 * @return {React.Component}
 */
function withTopicData(WrappedComponent) {
	class TopicData extends Component {
		componentDidMount() {
			const { dispatch, exploreModel, topic, auth: { isLoggedIn } } = this.props
			if (topic && !(topic in exploreModel.byTopic)) {
				dispatch(exploreApi.actions.topic.get({ topic }, { auth: isLoggedIn }))
			}
		}

		render() {
			const { exploreModel, topic } = this.props
			return (
				<WrappedComponent
					{...this.props}
					usfmsForTopic={exploreModel.byTopic[topic]}
				/>
			)
		}
	}

	TopicData.propTypes = {
		dispatch: PropTypes.func.isRequired,
		exploreModel: PropTypes.object.isRequired,
		topic: PropTypes.string.isRequired,
		auth: PropTypes.object.isRequired
	}

	TopicData.defaultProps = {

	}

	function mapStateToProps(state) {
		return {
			exploreModel: getExploreModel(state),
			auth: state.auth
		}
	}

	return connect(mapStateToProps, null)(TopicData)
}

export default withTopicData
