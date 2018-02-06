import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import exploreApi from '../index'
import getExploreModel from '../../../models/explore'

/**
 * HOC which passes down explore topics as well as the explore data model
 * @param  {React.Component} WrappedComponent [component to extend/pass props to]
 * @return {React.Component}
 */
function withTopicsData(WrappedComponent) {
	class TopicsData extends Component {
		componentDidMount() {
			const { dispatch, exploreModel } = this.props
			if (!(exploreModel.allTopics.length > 0)) {
				dispatch(exploreApi.actions.topics.get())
			}
		}

		render() {
			const { exploreModel } = this.props
			return (
				<WrappedComponent
					topics={exploreModel.allTopics}
					{...this.props}
				/>
			)
		}
  }

	TopicsData.propTypes = {
		dispatch: PropTypes.func.isRequired,
		exploreModel: PropTypes.object.isRequired
	}

	TopicsData.defaultProps = {

	}

	function mapStateToProps(state) {
		return {
			exploreModel: getExploreModel(state),
		}
	}

	return connect(mapStateToProps, null)(TopicsData)
}

export default withTopicsData
