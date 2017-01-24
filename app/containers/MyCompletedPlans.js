import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import CompletedPlans from '../features/PlanDiscovery/components/CompletedPlans'

class MyCompletedPlans extends Component {
	render() {
		return (
			<CompletedPlans {...this.props} />
		)
	}
}

function mapStateToProps(state) {
	return {
		completedPlans: state.readingPlans.completedPlans,
		auth: (state.auth),
		serverLanguageTag: state.serverLanguageTag
	}
}

export default connect(mapStateToProps, null)(MyCompletedPlans)
