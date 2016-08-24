import React, { Component } from 'react'
import AboutPlan from '../features/PlanDiscovery/components/AboutPlan'
import { connect } from 'react-redux'

class AboutPlanView extends Component {
	render() {
		return (
			<AboutPlan {...this.props} />
		)
	}
}

function mapStateToProps(state) {
	return {
		imageConfig: (state.plansDiscovery && state.plansDiscovery.configuration && state.plansDiscovery.configuration.images) ? state.plansDiscovery.configuration.images : {},
		readingPlan: (state.plansDiscovery && state.plansDiscovery.plans) ? state.plansDiscovery.plans : {}
	}
}

export default connect(mapStateToProps, null)(AboutPlanView)