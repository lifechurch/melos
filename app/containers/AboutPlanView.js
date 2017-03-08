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
		readingPlan: (state.plansDiscovery && state.plansDiscovery.plans) ? state.plansDiscovery.plans : null,
		recommendedPlans: state.readingPlans && state.readingPlans.recommendedPlans ? state.readingPlans.recommendedPlans : null,
		savedPlans: state.readingPlans && state.readingPlans.savedPlans ? state.readingPlans.savedPlans : null,
		auth: (state.auth),
		serverLanguageTag: state.serverLanguageTag
	}
}

export default connect(mapStateToProps, null)(AboutPlanView)
