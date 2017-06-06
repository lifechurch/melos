import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import SubscribedPlans from '../features/PlanDiscovery/components/SubscribedPlans'

class MySubscribedPlans extends Component {
	render() {
		return (
			<SubscribedPlans {...this.props} />
		)
	}
}

function mapStateToProps(state) {
	return {
		subscribedPlans: state.readingPlans.subscribedPlans,
		auth: (state.auth),
		serverLanguageTag: state.serverLanguageTag
	}
}

export default connect(mapStateToProps, null)(MySubscribedPlans)
